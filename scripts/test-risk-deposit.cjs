// Exercise questionnaire validation and the proposal request boundary without live writes.
const test = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const vm = require('node:vm')
const ts = require('typescript')

function load(relativePath, imports) {
  const filename = path.resolve(__dirname, '..', relativePath)
  const code = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText
  const target = { exports: {} }
  vm.runInNewContext(code, {
    module: target, exports: target.exports,
    require: (name) => {
      assert.ok(Object.hasOwn(imports, name), `Unexpected import: ${name}`)
      return imports[name]
    },
  }, { filename })
  return target.exports
}

const questions = load('src/lib/clients/schemas/risk-questions.ts', {
  '@/utils/providers/TranslationProvider': {},
})
const { risk_assesment_schema } = load('src/lib/clients/schemas/risk-profile.tsx', {
  zod: require('zod'), './risk-questions': questions,
})
const values = { name: 'Deposit Test', email: 'deposit@example.com', type: 2.5, loss: 2, gain: 3, period: 2, diversification: 2, goals: 2 }

test('required deposit rejects missing, empty, zero, negative and non-finite amounts in both languages', () => {
  for (const lang of ['en', 'es']) {
    const dictionary = require(`../src/app/[lang]/${lang}.json`)
    const schema = risk_assesment_schema((key) => key.split('.').reduce((value, part) => value?.[part], dictionary) ?? key)
    for (const amount of [undefined, null, '', ' ', 0, -1, 0.001, 1.234, 'invalid', NaN, Infinity, -Infinity]) {
      const result = schema.safeParse({ ...values, starting_amount: amount })
      assert.equal(result.success, false, `${lang}: ${String(amount)}`)
      assert.equal(result.error.issues[0].path[0], 'starting_amount')
      assert.equal(result.error.issues[0].message, dictionary.risk.form.estimated_deposit_error)
    }
  }
})

test('positive deposits retain cents and do not affect risk scoring', () => {
  const schema = risk_assesment_schema((key) => key)
  for (const amount of [0.01, 25000.75, '100000.25']) {
    const parsed = schema.parse({ ...values, starting_amount: amount })
    assert.equal(parsed.starting_amount, Number(amount))
    assert.equal(questions.calcRiskScore(parsed), 2.25)
  }
})

test('proposal request sends the deposit separately from risk answers and retains existing callers', async () => {
  const requests = []
  const api = load('src/utils/clients/investment_proposals.ts', {
    '../api-result': { unwrapApiResult: (value) => value.data },
    '../api': { accessAPIResult: async (...args) => { requests.push(args); return { ok: true, data: { id: 'proposal', starting_amount: args[2].starting_amount } } } },
  })
  const profile = { id: 'profile', name: values.name, email: values.email, score: 2.25, answers: {} }
  const result = await api.CreateInvestmentProposal(profile, 25000.75)
  assert.equal(result.starting_amount, 25000.75)
  assert.equal(requests[0][0], '/investment_proposals/create/risk')
  assert.equal(requests[0][1], 'POST')
  assert.equal(requests[0][2].risk_profile, profile)
  assert.equal(requests[0][2].starting_amount, 25000.75)
  await api.CreateInvestmentProposal(profile)
  assert.equal(requests[1][2].starting_amount, undefined)
})

test('risk-profile request preserves the estimated deposit independently of proposal creation', async () => {
  let request
  const api = load('src/utils/clients/risk-profile.ts', {
    '../api-result': { unwrapApiResult: (value) => value.data },
    '@/utils/api': { accessAPIResult: async (...args) => { request = args; return { ok: true, data: { id: 'profile' } } } },
  })
  const payload = { name: values.name, email: values.email, score: 2.25, answers: {}, estimated_deposit: 12345.67 }
  await api.CreateRiskProfile(payload)
  assert.equal(request[0], '/risk_profiles/create')
  assert.equal(request[2].data.estimated_deposit, 12345.67)
})
