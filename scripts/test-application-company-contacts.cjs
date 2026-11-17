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
  const failures=[],toasts=[]
  const {createApplicationSyncQueue}=load(fs.readFileSync('src/utils/clients/application-sync-queue.ts','utf8'))
  const result=load(fs.readFileSync('src/utils/api-result.ts','utf8'))
  const feedback=load(fs.readFileSync('src/utils/clients/application-sync-feedback.ts','utf8'),{require:()=>result})
  const context = {
    ...feedback,
    structuredClone,File:class File{},syncGeneration:{current:0},mounted:{current:true},
    syncQueue:{current:createApplicationSyncQueue()},setContactSync:s=>statuses.push(s),
    setSyncFailure:s=>failures.push(s),toast:s=>toasts.push(s),t:key=>key,
    console:{error(){}},sendClientLog:async(...args)=>logs.push(args),
    getCanonicalDocumentCategory:value=>value,
    ReconcileApplicationContacts:async id=>{calls.push(id);return [{name:'Ana Example',contact_id:'person',type:'person'}]},
    ReadContactScreenings:async id=>screenings.filter(s=>s.contact_id===id),
    CreateContactScreening:async id=>screenings.push({contact_id:id}),
    ReadContactDocuments:async id=>({documents:documents.filter(d=>d.contact_id===id)}),
    UploadContactDocument:async(account_id,contact_id,name,length,sha1_checksum)=>documents.push({account_id,contact_id,sha1_checksum}),
  }
  const api=load(pieces.join('\n')+'\nmodule.exports={queueReconciliation,redactFormValuesForLogs}',context)
  return {api,context,screenings,documents,statuses,logs,calls,failures,toasts,ApiRequestError:result.ApiRequestError}
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
    await assert.rejects(h.api.queueReconciliation(values(),'account',true),/Application setup needs attention/)
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
  await assert.rejects(h.api.queueReconciliation(v,'account',false),error=>error.failure.kind==='documents')
})

test('identity conflicts retain review guidance and a support reference without raw upstream messages',async()=>{
  const h=harness()
  h.context.ReconcileApplicationContacts=async()=>{throw new h.ApiRequestError('private synthetic identity',409,'contact_identity_conflict','fixture-request')}
  await assert.rejects(h.api.queueReconciliation(values(),'account',false),error=>error.failure.kind==='review')
  assert.equal(h.failures.at(-1).requestId,'fixture-request')
  assert.equal(h.toasts.at(-1).description,'forms.application_sync.review')
  assert.ok(!JSON.stringify(h.logs).includes('private synthetic identity'))
})

test('an obsolete failure cannot overwrite feedback for a newer queued attempt',async()=>{
  const h=harness()
  let release
  const gate=new Promise(resolve=>{release=resolve})
  let count=0
  h.context.ReconcileApplicationContacts=async()=>{
    if(++count===1){await gate;throw new h.ApiRequestError('old failure',503,'contact_identity_unavailable')}
    return [{name:'Ana Example',contact_id:'person',type:'person'}]
  }
  const first=h.api.queueReconciliation(values(),'account',false)
  const recovered=h.api.queueReconciliation(values(),'account',false)
  release()
  await assert.rejects(first)
  await recovered
  assert.equal(h.statuses.at(-1),'ready')
  assert.equal(h.toasts.length,0)
  assert.ok(!h.failures.some(Boolean))
})

test('unmounted forms emit no failure feedback while the rejected attempt still reaches its caller',async()=>{
  const h=harness()
  h.context.mounted.current=false
  h.context.ReconcileApplicationContacts=async()=>{throw Error('unavailable')}
  await assert.rejects(h.api.queueReconciliation(values(),'account',false))
  assert.equal(h.toasts.length,0)
  assert.ok(!h.statuses.includes('failed'))
})

test('multiple documents reuse one saved inventory per holder and skip confirmed duplicate uploads',async()=>{
  const h=harness(),v=values()
  let reads=0
  const original=h.context.ReadContactDocuments
  h.context.ReadContactDocuments=async id=>{reads++;return original(id)}
  const second=structuredClone(v.documents[0]);second.attachedFile.sha1Checksum='second-file'
  v.documents.push(second,structuredClone(v.documents[0]))
  await h.api.queueReconciliation(v,'account',false)
  assert.equal(reads,1)
  assert.equal(h.documents.length,2)
  // A later attempt must refresh the inventory rather than trust stale cache.
  h.documents.length=0
  await h.api.queueReconciliation(v,'account',false)
  assert.equal(reads,2)
  assert.equal(h.documents.length,2)
})

test('a failed upload is retried from fresh saved-file evidence without duplicating earlier successful files',async()=>{
  const h=harness(),v=values()
  const second=structuredClone(v.documents[0]);second.attachedFile.sha1Checksum='second-file'
  v.documents.push(second)
  const original=h.context.UploadContactDocument
  let failed=false
  h.context.UploadContactDocument=async(...args)=>{
    if(args[4]==='second-file'&&!failed){failed=true;throw Error('upload failed')}
    return original(...args)
  }
  await assert.rejects(h.api.queueReconciliation(v,'account',false))
  assert.equal(h.documents.length,1)
  await h.api.queueReconciliation(v,'account',false)
  assert.equal(h.documents.length,2)
})

test('saved-file inventories remain separate for holders sharing the same file',async()=>{
  const h=harness(),v=values()
  h.context.ReconcileApplicationContacts=async()=>[
    {name:'Ana Example',contact_id:'one',type:'person'},
    {name:'Luis Example',contact_id:'two',type:'person'},
  ]
  v.documents[0].signedBy.push('Luis Example')
  await h.api.queueReconciliation(v,'account',false)
  assert.equal(h.documents.length,2)
  assert.deepEqual(h.documents.map(d=>d.contact_id),['one','two'])
})
