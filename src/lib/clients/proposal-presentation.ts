// Shared proposal presentation rules: money weights are independent of asset counts.
export function proposalBucketStats(assets: { percentage?: number; current_yield?: number }[], fallbackWeight: number) {
  const weighted = assets.length > 0 && assets.every(asset => asset.percentage != null && Number.isFinite(Number(asset.percentage)))
  const holdings = assets.filter(asset => asset.percentage == null || Number(asset.percentage) > 0)
  const weight = weighted ? holdings.reduce((sum, asset) => sum + Number(asset.percentage), 0) : fallbackWeight
  const avgYield = weighted && weight > 0
    ? holdings.reduce((sum, asset) => sum + Number(asset.percentage) * Number(asset.current_yield || 0), 0) / weight
    : holdings.length ? holdings.reduce((sum, asset) => sum + Number(asset.current_yield || 0), 0) / holdings.length : 0
  return { holdings, weight, avgYield }
}
