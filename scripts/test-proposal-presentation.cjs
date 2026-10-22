const test = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const vm = require('node:vm')
const ts = require('typescript')
const path = require('node:path')
const target = { exports: {} }
vm.runInNewContext(ts.transpileModule(fs.readFileSync(path.join(__dirname, '../src/lib/clients/proposal-presentation.ts'), 'utf8'), {compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText, {module:target,exports:target.exports})
const stats = target.exports.proposalBucketStats

test('money allocation and return use weights rather than asset counts', () => {
 const result = stats([{percentage:.5,current_yield:10},{percentage:.1,current_yield:2}], .2)
 assert.ok(Math.abs(result.weight - .6) < 1e-10)
 assert.ok(Math.abs(result.avgYield - 5.2/.6) < 1e-10)
})
test('zero holdings do not appear or affect return', () => {
 const result = stats([{percentage:0,current_yield:20}], 0)
 assert.equal(result.weight,0)
 assert.equal(result.holdings.length,0)
 assert.equal(stats([],0).weight,0)
})
