// Exercise Next's installed optimizer with harmless, locally generated image data.
// No application credentials, external image URLs, or exploit payloads are used.
const test = require('node:test')
const assert = require('node:assert/strict')
const { imageOptimizer, isAvifDecodeSafe } = require('next/dist/server/image-optimizer')
const { defaultConfig } = require('next/dist/server/config-shared')
const sharpModule = require('sharp')
const sharp = sharpModule.default || sharpModule
const semver = require('semver')

test('unsafe or unknown AVIF decoder versions cannot be classified as safe', () => {
  assert.equal(typeof isAvifDecodeSafe, 'function', 'Next must include its AVIF decoder safety gate')
  for (const version of [null, 'unknown', '1.20.2', '1.23.1']) assert.equal(isAvifDecodeSafe(version), false, String(version))
  for (const version of ['1.23.2', '1.24.0']) assert.equal(isAvifDecodeSafe(version), true, version)
})

test('actual optimizer bypasses AVIF on unsafe decoders and still optimizes PNG', async () => {
  const decoderSafe = Boolean(sharp.versions.heif && semver.gte(sharp.versions.heif, '1.23.2'))
  const config = { ...defaultConfig, images: { ...defaultConfig.images }, experimental: { ...defaultConfig.experimental } }
  const source = sharp({ create: { width: 8, height: 8, channels: 3, background: '#123456' } })
  for (const format of ['avif', 'png']) {
    const buffer = await source.clone().toFormat(format).toBuffer()
    const output = await imageOptimizer(
      { buffer, contentType: `image/${format}`, cacheControl: null, etag: `fixture-${format}` },
      { href: `/synthetic.${format}`, width: 4, quality: 75, mimeType: 'image/webp' },
      config, { isDev: false, silent: true },
    )
    assert.equal(output.error, undefined)
    if (format === 'avif' && !decoderSafe) {
      assert.equal(output.buffer, buffer, 'unsafe AVIF must bypass the decoder')
      assert.equal(output.contentType, 'image/avif')
    } else {
      assert.equal(output.contentType, 'image/webp')
      assert.equal((await sharp(output.buffer).metadata()).width, 4)
    }
  }
})
