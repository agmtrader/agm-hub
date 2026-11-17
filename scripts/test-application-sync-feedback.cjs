// Controlled error recovery through the real serialized API-result boundary
// and Documents component. Providers are excluded from this component check.
const test = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const vm = require('node:vm')
const ts = require('typescript')
const React = require('react')
const { renderToStaticMarkup } = require('react-dom/server')

function load(filename, dependencies = {}) {
  const module = { exports: {} }
  const code = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
  }).outputText
  vm.runInNewContext(code, { module, exports: module.exports,
    require: name => name in dependencies ? dependencies[name] : require(name) })
  return module.exports
}
const result = load('src/utils/api-result.ts')
const feedback = load('src/utils/clients/application-sync-feedback.ts', { '../api-result': result })
function serializedFailure(code, status = 409, operation = 'contacts_and_links') {
  let error
  try { result.unwrapApiResult(JSON.parse(JSON.stringify({ ok: false, error: {
    message: 'private synthetic identity', code, status, requestId: 'fixture-request',
  } }))) } catch (failure) { error = failure }
  return feedback.applicationSyncFailure(error, operation)
}

for (const code of ['contact_identity_conflict', 'contact_identity_ambiguous', 'contact_identity_insufficient']) {
  test(`${code} requires review instead of suggesting a blind retry`, () => {
    const failure = serializedFailure(code)
    assert.equal(failure.kind, 'review')
    assert.equal(feedback.canRetryApplicationSync(failure), false)
    assert.ok(!JSON.stringify(failure).includes('private synthetic identity'))
  })
}
test('malformed identity points to personal information; account/auth problems require support', () => {
  assert.equal(serializedFailure('contact_identity_invalid', 422).kind, 'invalid')
  for (const code of ['contact_identity_account_missing', 'contact_identity_not_pending']) assert.equal(serializedFailure(code).kind, 'support')
  for (const status of [401, 403]) assert.equal(serializedFailure(undefined, status, 'documents').kind, 'support')
})
test('temporary, screening and document failures remain retryable', () => {
  for (const [operation, kind] of [['contacts_and_links', 'temporary'], ['screenings', 'screenings'], ['documents', 'documents']]) {
    const failure = serializedFailure('contact_identity_unavailable', 503, operation)
    assert.equal(failure.kind, kind)
    assert.equal(feedback.canRetryApplicationSync(failure), true)
  }
  assert.equal(feedback.applicationSyncFailure(new Error('unexpected')).kind, 'temporary')
})
test('untrusted message and invalid support reference do not enter the recovery model', () => {
  const failure = feedback.applicationSyncFailure(new result.ApiRequestError('private synthetic identity', 503, undefined, 'private reference with spaces'), 'contacts_and_links')
  assert.equal(failure.requestId, undefined)
  assert.ok(!JSON.stringify(failure).includes('private'))
})

for (const language of ['en', 'es']) {
  const dict = JSON.parse(fs.readFileSync(`src/app/[lang]/${language}.json`, 'utf8'))
  const t = key => key.split('.').reduce((value, part) => value?.[part], dict)
  const provider = { useTranslationProvider: () => ({ t, lang: language }) }
  const button = { Button: ({ children, ...props }) => React.createElement('button', props, children) }
  const status = load('src/components/hub/apply/ApplicationSyncStatus.tsx', {
    '@/components/ui/button': button, '@/utils/providers/TranslationProvider': provider,
    '@/utils/clients/application-sync-feedback': feedback,
  })
  const card = ({ children }) => React.createElement('div', null, children)
  const documents = load('src/components/hub/apply/DocumentsStep.tsx', {
    '@/components/ui/button': button, '@/utils/providers/TranslationProvider': provider,
    '@/utils/clients/application-sync-feedback': feedback, './ApplicationSyncStatus': status,
    '@/utils/clients/read-batches': { ReadApplicationDocumentHolders: () => { throw Error('Unexpected provider call') } },
    './ContactDocuments': { default: () => null, __esModule: true },
    '@/components/ui/card': { Card: card, CardContent: card, CardHeader: card, CardTitle: card },
  }).default
  for (const kind of ['review', 'invalid', 'support', 'temporary', 'documents', 'screenings']) {
    test(`${language} Documents ${kind} state shows the appropriate recovery action`, () => {
      const html = renderToStaticMarkup(React.createElement(documents, {
        accountId: 'fixture', contactSync: 'failed', syncFailure: { kind, requestId: 'fixture-request' },
        onRetryContacts() {}, onReviewPersonalInfo() {},
      }))
      assert.ok(html.includes('role="alert"'))
      assert.ok(html.includes(t(`forms.application_sync.${kind}`)))
      assert.ok(html.includes('fixture-request'))
      assert.equal(html.includes(`>${t('forms.application_sync.retry')}</button>`), feedback.canRetryApplicationSync({ kind }))
      assert.equal(html.includes(`>${t('forms.application_sync.review_personal')}</button>`), kind === 'invalid')
      assert.ok(!html.includes('private synthetic identity'))
    })
  }
  test(`${language} pending feedback remains a status and offers no retry`, () => {
    const html = renderToStaticMarkup(React.createElement(documents, { accountId: 'fixture', contactSync: 'pending' }))
    assert.ok(html.includes('role="status"'))
    assert.ok(html.includes(t('forms.application_sync.preparing')))
    assert.ok(!html.includes('<button'))
  })
}
