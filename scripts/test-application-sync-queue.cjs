const test = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const vm = require('node:vm')
const ts = require('typescript')
const target = { exports: {} }
vm.runInNewContext(ts.transpileModule(fs.readFileSync('src/utils/clients/application-sync-queue.ts', 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
}).outputText, { module: target, exports: target.exports })
const { createApplicationSyncQueue } = target.exports
const deferred = () => { let resolve; const promise = new Promise(r => { resolve = r }); return { promise, resolve } }

test('snapshots run in order without overlapping; final completion waits for earlier work', async () => {
  const queue = createApplicationSyncQueue(), gate = deferred(), events = []
  const first = queue.enqueue(async () => { events.push('first-start'); await gate.promise; events.push('first-end') })
  const final = queue.enqueue(async () => { events.push('final'); return 'complete' })
  let completed = false
  void final.then(() => { completed = true })
  await new Promise(setImmediate)
  assert.deepEqual(events, ['first-start'])
  assert.equal(completed, false)
  gate.resolve()
  await first
  assert.equal(await final, 'complete')
  assert.deepEqual(events, ['first-start', 'first-end', 'final'])
})

for (const operation of ['contact', 'link', 'screening', 'document']) {
  test(`${operation} rejection reaches the caller; a later queued attempt can recover`, async () => {
    const queue = createApplicationSyncQueue()
    await assert.rejects(queue.enqueue(async () => { throw new Error(`${operation} unavailable`) }), /unavailable/)
    assert.equal(await queue.enqueue(async () => 'reconciled'), 'reconciled')
  })
}
