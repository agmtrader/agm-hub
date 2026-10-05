// Verify the real Hub transport with mocked authentication and HTTP responses.
const test = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const vm = require('node:vm')
const ts = require('typescript')

function loadTransport(payload) {
  const filename = path.resolve(__dirname, '../src/utils/api.ts')
  const code = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText
  const target = { exports: {} }
  vm.runInNewContext(code, {
    module: target, exports: target.exports,
    process: { env: { AGM_API_HUB_EMAIL: 'test@example.com', AGM_API_HUB_PASSWORD: 'test' } },
    fetch: async (url) => url.endsWith('/token')
      ? Response.json({ access_token: 'test-token', expires_in: 3600 })
      : Response.json(payload, { status: 422, headers: { 'X-Request-ID': 'test-request' } }),
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
