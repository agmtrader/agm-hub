// Verify the real Hub transport with mocked authentication and HTTP responses.
const test = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const vm = require('node:vm')
const ts = require('typescript')

const resultCode = ts.transpileModule(fs.readFileSync(path.resolve(__dirname, '../src/utils/api-result.ts'), 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
}).outputText
const resultModule = { exports: {} }
vm.runInNewContext(resultCode, { module: resultModule, exports: resultModule.exports })

function loadTransport(payload, status = 422, mode = 'normal') {
  const filename = path.resolve(__dirname, '../src/utils/api.ts')
  const code = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText
  const target = { exports: {} }
  vm.runInNewContext(code, {
    module: target, exports: target.exports,
    require: (name) => { assert.equal(name, './api-result'); return resultModule.exports },
    process: { env: { AGM_API_HUB_EMAIL: 'test@example.com', AGM_API_HUB_PASSWORD: 'test' } },
    fetch: async (url) => {
      if (!url.endsWith('/token') && mode === 'network') throw new TypeError('synthetic network failure')
      if (!url.endsWith('/token') && mode === 'bug') throw new Error('Unexpected test harness bug')
      return url.endsWith('/token')
      ? Response.json({ access_token: 'test-token', expires_in: 3600 })
      : Response.json(payload, { status, headers: { 'X-Request-ID': 'test-request' } })
    },
  }, { filename })
  return target.exports
}

test('API error field reaches the Hub with its request ID', async () => {
  const api = loadTransport({ error: 'No eligible assets for etfs', code: 'proposal_assets_unavailable' })
  await assert.rejects(api.accessAPI('/investment_proposals/create/risk', 'POST', {}),
    { message: 'No eligible assets for etfs (request ID: test-request)' })
})

test('existing message field retains precedence', async () => {
  const api = loadTransport({ message: 'Specific message', error: 'Other error' })
  await assert.rejects(api.accessAPI('/test', 'POST', {}),
    { message: 'Specific message (request ID: test-request)' })
})

test('unknown error payload retains the generic message', async () => {
  const api = loadTransport({})
  await assert.rejects(api.accessAPI('/test', 'POST', {}),
    { message: 'The request could not be completed. (request ID: test-request)' })
})

for (const status of [400, 401, 403, 409, 422, 429, 500]) {
  test(`HTTP ${status} survives serialized action result and client reconstruction`, async () => {
    const api = loadTransport({ error: 'No eligible ETF assets', code: 'proposal_assets_unavailable' }, status)
    const result = JSON.parse(JSON.stringify(await api.accessAPIResult('/investment_proposals/create/risk', 'POST', {})))
    assert.equal(result.ok, false)
    assert.equal(result.error.status, status)
    assert.throws(() => resultModule.exports.unwrapApiResult(result), {
      name: 'ApiRequestError', message: 'No eligible ETF assets (request ID: test-request)',
      status, code: 'proposal_assets_unavailable', requestId: 'test-request',
    })
  })
}

test('successful action returns data unchanged', async () => {
  const result = await loadTransport({ id: 'synthetic-proposal' }, 200).accessAPIResult('/test', 'GET')
  assert.deepEqual(JSON.parse(JSON.stringify(resultModule.exports.unwrapApiResult(result))), { id: 'synthetic-proposal' })
})

test('network failure is a controlled unavailable result', async () => {
  const result = await loadTransport({}, 200, 'network').accessAPIResult('/test', 'GET')
  assert.equal(result.ok, false)
  assert.equal(result.error.message, 'The AGM API is unavailable. Please try again shortly.')
})
