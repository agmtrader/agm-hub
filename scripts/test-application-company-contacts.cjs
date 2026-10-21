// Identity decisions live in the API's PostgreSQL tests; this exercises the real
// form orchestration without substituting client-side identity-matching rules.
const test = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const vm = require('node:vm')
const ts = require('typescript')
function load(code, context = {}) {
  const module = { exports: {} }
  vm.runInNewContext(ts.transpileModule(code, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText,
    Object.assign(context, { module, exports: module.exports }))
  return module.exports
}
function harness() {
  const path = 'src/components/hub/apply/IBKRApplicationForm.tsx'
  const file = ts.createSourceFile(path, fs.readFileSync(path, 'utf8'), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX)
  const names = new Set(['ensureContactScreenings', 'ensureContactDocuments', 'queueReconciliation', 'redactFormValuesForLogs'])
  const pieces = []
  function visit(node) {
    if (ts.isFunctionDeclaration(node) && names.has(node.name?.text)) pieces.push(node.getText(file))
    if (ts.isVariableDeclaration(node) && names.has(node.name.getText(file))) pieces.push('const ' + node.getText(file) + ';')
    ts.forEachChild(node, visit)
  }
  visit(file)
  const screenings=[],documents=[],statuses=[],logs=[],calls=[]
  const {createApplicationSyncQueue}=load(fs.readFileSync('src/utils/clients/application-sync-queue.ts','utf8'))
  const context = {
    structuredClone,File:class File{},syncGeneration:{current:0},mounted:{current:true},
    syncQueue:{current:createApplicationSyncQueue()},setContactSync:s=>statuses.push(s),
    console:{error(){}},sendClientLog:async(...args)=>logs.push(args),
    getCanonicalDocumentCategory:value=>value,
    ReconcileApplicationContacts:async id=>{calls.push(id);return [{name:'Ana Example',contact_id:'person',type:'person'}]},
    ReadContactScreenings:async id=>screenings.filter(s=>s.contact_id===id),
    CreateContactScreening:async id=>screenings.push({contact_id:id}),
    ReadContactDocuments:async id=>({documents:documents.filter(d=>d.contact_id===id)}),
    UploadContactDocument:async(account_id,contact_id,name,length,sha1_checksum)=>documents.push({account_id,contact_id,sha1_checksum}),
  }
  const api=load(pieces.join('\n')+'\nmodule.exports={queueReconciliation,redactFormValuesForLogs}',context)
  return {api,context,screenings,documents,statuses,logs,calls}
}
const values=()=>({customer:{type:'INDIVIDUAL'},documents:[{formNumber:5001,signedBy:['Ana Example'],attachedFile:{sha1Checksum:'fixture-checksum'},payload:{data:'Zml4dHVyZQ==',mimeType:'application/pdf'}}]})
test('background reconciliation uses the saved-account matcher and finalization reuses screening/documents',async()=>{
  const h=harness()
  await h.api.queueReconciliation(values(),'account',false)
  assert.deepEqual(h.calls,['account'])
  assert.equal(h.screenings.length,0)
  await h.api.queueReconciliation(values(),'account',true)
  await h.api.queueReconciliation(values(),'account',true)
  assert.equal(h.screenings.length,1)
  assert.equal(h.documents.length,1)
})
for(const [method,operation] of [['ReconcileApplicationContacts','contacts_and_links'],['CreateContactScreening','screenings'],['UploadContactDocument','documents']]) {
  test(`${method} failure is logged and rejects final reconciliation; explicit retry recovers`,async()=>{
    const h=harness(),original=h.context[method]
    h.context[method]=async()=>{throw Error('Boundary unavailable')}
    await assert.rejects(h.api.queueReconciliation(values(),'account',true),/Boundary unavailable/)
    assert.equal(h.statuses.at(-1),'failed')
    assert.equal(h.logs.at(-1)[1].operation,operation)
    h.context[method]=original
    await h.api.queueReconciliation(values(),'account',true)
    assert.equal(h.statuses.at(-1),'ready')
  })
}
test('a queued document snapshot does not change when the applicant edits the live form',async()=>{
  const h=harness(),v=values(),attempt=h.api.queueReconciliation(v,'account',false)
  v.documents[0].signedBy=['Changed Name']
  await attempt
  assert.equal(h.documents.length,1)
})
test('birthdays and government identification are redacted from form logs',()=>{
  const h=harness(),value=h.api.redactFormValuesForLogs({customer:{dateOfBirth:'1990-01-01',identification:{nationalCard:'001234',passport:'ABC'}}})
  const text=JSON.stringify(value)
  assert.ok(!text.includes('1990')&&!text.includes('001234')&&!text.includes('ABC'))
})
test('document holder external ID disambiguates equal names and cannot override a different signer',async()=>{
  const h=harness(),v=values()
  h.context.ReconcileApplicationContacts=async()=>[
    {name:'Ana Example',contact_id:'one',externalId:'first',type:'person'},
    {name:'Ana Example',contact_id:'two',externalId:'second',type:'person'},
  ]
  v.documents[0].externalIndividualId='second'
  await h.api.queueReconciliation(v,'account',false)
  assert.equal(h.documents[0].contact_id,'two')
  v.documents[0].signedBy=['Unrelated Name']
  await assert.rejects(h.api.queueReconciliation(v,'account',false),/document signer/)
})
