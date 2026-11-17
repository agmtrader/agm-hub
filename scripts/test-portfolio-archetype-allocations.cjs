const test = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const vm = require('node:vm')
const ts = require('typescript')
const filename = path.resolve(__dirname, '../src/lib/clients/portfolio-planner.ts')
const code = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
}).outputText
const mod = { exports: {} }
vm.runInNewContext(code, { module: mod, exports: mod.exports, require: () => ({}) }, { filename })
const planner = mod.exports
const source = fs.readFileSync(path.resolve(__dirname, '../../agm-api/src/components/clients/risk_profiles.py'), 'utf8')
const archetypes = JSON.parse(source.match(/risk_archetypes = (\[[\s\S]*?\n  \])/)[1])
const close = (actual, expected) => assert.ok(Math.abs(actual - expected) < 1e-8, `${actual} != ${expected}`)
for (const archetype of archetypes) {
  test(`${archetype.name} planner weights reconstruct risk_profiles.py`, () => {
    const allocation = planner.getAllocationFromRiskArchetype(archetype)
    const ratings = planner.getBondRatingAllocationFromRiskArchetype(archetype)
    close(allocation.treasuries / 100, archetype.treasuries)
    close(allocation.stocks / 100, archetype.etfs)
    for (const [key, sourceKey] of [['aaa', 'bonds_aaa_a'], ['bbb', 'bonds_bbb'], ['bb', 'bonds_bb']]) {
      close(allocation.bonds * ratings[key] / 10000, archetype[sourceKey])
    }
    close(ratings.aaa + ratings.bbb + ratings.bb, 100)
  })
}
test('fractional edit preserves locked BB and totals 100 without overshoot', () => {
  const result = planner.normalizeBondRatingAllocation({ aaa: 22.5, bbb: 67.5, bb: 10 }, 'aaa', 22.6, ['bb'])
  close(result.aaa, 22.6)
  close(result.bbb, 67.4)
  close(result.bb, 10)
  close(result.aaa + result.bbb + result.bb, 100)
})
test('fractional reduction fills available capacity and preserves locks', () => {
  const result = planner.normalizeBondRatingAllocation({ aaa: 22.5, bbb: 67.5, bb: 10 }, 'bbb', 67.4, ['bb'])
  close(result.aaa, 22.6)
  close(result.bbb, 67.4)
  close(result.bb, 10)
})
