const test = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const ts = require('typescript')
const vm = require('node:vm')
function lookup() {
  const target = {exports:{}}, calls = []
  const code = ts.transpileModule(fs.readFileSync('src/utils/clients/contact.ts','utf8'), {
    compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020},
  }).outputText
  vm.runInNewContext(code,{module:target,exports:target.exports,URLSearchParams,
    require: name => {if(name==='../api-result')return {};assert.equal(name,'../api');return {accessAPI:async(url,method)=>{calls.push([url,method]);return [{id:'one'},{id:'two'}]}}},
  })
  return {...target.exports,calls}
}
test('plural email search retains all results and URL-encodes literal + and & characters',async()=>{
  const api=lookup(), result=await api.ReadContactsByEmail(' person+tag&x@example.test ')
  assert.equal(result.length,2)
  const url=new URL(api.calls[0][0],'https://fixture.test')
  assert.equal(url.searchParams.get('email'),'person+tag&x@example.test')
  assert.equal([...url.searchParams].length,1)
})
test('blank email is rejected instead of issuing an unfiltered contact read',async()=>{
  const api=lookup()
  await assert.rejects(api.ReadContactsByEmail('  '),/nonblank/)
  assert.equal(api.calls.length,0)
})

function reconcileClient(result) {
  const target={exports:{}}, calls=[]
  const results={exports:{}}
  vm.runInNewContext(ts.transpileModule(fs.readFileSync('src/utils/api-result.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText,{module:results,exports:results.exports})
  const code=ts.transpileModule(fs.readFileSync('src/utils/clients/contact.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText
  vm.runInNewContext(code,{module:target,exports:target.exports,URLSearchParams,require:name=>name==='../api-result'?results.exports:{accessAPIResult:async(...args)=>{calls.push(args);return JSON.parse(JSON.stringify(result))}}})
  return {api:target.exports,calls}
}
test('saved-account matcher sends only account ID through the result boundary',async()=>{
  const h=reconcileClient({ok:true,data:{linked_contacts:[{contact_id:'person',name:'Example',type:'person'}]}})
  const rows=await h.api.ReconcileApplicationContacts('account')
  assert.equal(rows[0].contact_id,'person')
  assert.deepEqual(JSON.parse(JSON.stringify(h.calls)),[['/contacts/reconcile_application','POST',{account_id:'account'}]])
})
test('identity review error survives Server Action result serialization',async()=>{
  const h=reconcileClient({ok:false,error:{message:'Identity needs review.',status:409,code:'contact_identity_conflict',requestId:'fixture-request'}})
  await assert.rejects(h.api.ReconcileApplicationContacts('account'),{message:'Identity needs review.',status:409,code:'contact_identity_conflict',requestId:'fixture-request'})
})
test('empty matcher response cannot count as completed contact setup',async()=>{
  const h=reconcileClient({ok:true,data:{linked_contacts:[]}})
  await assert.rejects(h.api.ReconcileApplicationContacts('account'),/required holders/)
})
