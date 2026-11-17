const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),ts=require('typescript')
function harness(deps={}) {
 const files=new Map()
 function load(name) {
  if(files.has(name))return files.get(name)
  const exports={};files.set(name,exports)
  const file='src/utils/'+name+'.ts'
  const code=ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText
  vm.runInNewContext(code,{module:{exports},exports,require:path=>{
   if(path==='../api-result')return load('api-result')
   if(path==='./read-batches-server')return load('clients/read-batches-server')
   return deps
  }})
  return exports
 }
 return {server:load('clients/read-batches-server'),client:load('clients/read-batches'),errors:load('api-result')}
}
test('reference dependencies begin in parallel in one batch',async()=>{
 const calls=[],pending=[]
 const read=name=>()=>{calls.push(name);return new Promise(resolve=>pending.push(resolve))}
 const h=harness({GetFinancialRanges:read('ranges'),GetBusinessAndOccupation:read('business'),GetForms:read('forms')})
 const batch=h.server.ApplicationReferencesResult(['form'])
 assert.deepEqual(calls,['ranges','business','forms'])
 pending.forEach(resolve=>resolve({synthetic:true}))
 assert.equal((await batch).ok,true)
})
test('holders deduplicate IDs before reads and expose only id/name',async()=>{
 const calls=[];const h=harness({ReadAccountContacts:async()=>[{contact_id:'a'},{contact_id:'a'},{contact_id:'b'}],ReadContactByID:async id=>{calls.push(id);return{id,name:'Holder '+id,government_id:'excluded'}}})
 const result=JSON.parse(JSON.stringify(await h.server.ApplicationDocumentHoldersResult('account')))
 assert.deepEqual(calls,['a','b'])
 assert.deepEqual(result.data,[{id:'a',name:'Holder a'},{id:'b',name:'Holder b'}])
})
test('risk context does not serialize unrelated answers or identifiers',async()=>{
 const h=harness({ReadRiskProfileById:async()=>({id:'p',score:5,answers:{private:'excluded'}}),ListRiskArchetypes:async()=>[]})
 const result=JSON.parse(JSON.stringify(await h.server.ProposalRiskContextResult('p')))
 assert.deepEqual(result.data,{profile:{score:5},archetypes:[]})
})
test('controlled batch failure survives result serialization',async()=>{
 const deps={};const h=harness(deps)
 deps.GetFinancialRanges=async()=>{throw new h.errors.ApiRequestError('Unavailable',503)}
 deps.GetBusinessAndOccupation=async()=>({});deps.GetForms=async()=>({})
 const result=JSON.parse(JSON.stringify(await h.server.ApplicationReferencesResult([])))
 assert.throws(()=>h.errors.unwrapApiResult(result),{message:'Unavailable',status:503})
})
test('in-flight reference prefetch is shared, completed responses are not cached',async()=>{
 let calls=0,release
 const h=harness({GetFinancialRanges:()=>{calls++;return new Promise(resolve=>release=resolve)},GetBusinessAndOccupation:async()=>({}),GetForms:async()=>({})})
 const one=h.client.ReadApplicationReferences(['form']),two=h.client.ReadApplicationReferences(['form'])
 assert.equal(calls,1);release({});await Promise.all([one,two])
 const three=h.client.ReadApplicationReferences(['form']);assert.equal(calls,2);release({});await three
})
