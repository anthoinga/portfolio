#!/usr/bin/env node
/**
 * Writes apps/studio/import/data.ndjson: the site's current content as Sanity
 * documents, with local images and videos referenced as files so
 * `sanity dataset import` uploads them.
 *
 *   pnpm --filter web export:sanity
 *   cd apps/studio && npx sanity dataset import import/data.ndjson production --replace
 *
 * Re-running is safe: documents have fixed ids, and --replace overwrites them.
 */
import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { buildDocuments } from './lib/sanity-docs.mjs'
import { loadModules, webRoot } from './lib/load-content.mjs'

const [fixtures] = await loadModules('/src/lib/data/fixtures.ts')

const missing = []
function asset(url, kind) {
	if (/^https?:\/\//i.test(url)) return { _type: 'reference', _sanityAsset: `${kind}@${url}` }
	const clean = url.split('?')[0]
	// Vite serves bundled assets from /src/…; everything else comes from /static.
	const abs = clean.startsWith('/src/') ? path.join(webRoot, clean) : path.join(webRoot, 'static', clean)
	if (!fs.existsSync(abs)) {
		missing.push(`${url}  →  ${abs}`)
		return { _type: 'reference', _sanityAsset: `${kind}@${pathToFileURL(abs).href}` }
	}
	return { _type: 'reference', _sanityAsset: `${kind}@${pathToFileURL(abs).href}` }
}

const docs = buildDocuments({
	settings: fixtures.siteSettingsFixture,
	settingsEs: fixtures.siteSettingsEs,
	projects: fixtures.projectsFixture,
	asset
})

if (missing.length) {
	console.error('These assets are referenced by the content but do not exist on disk:\n  ' + missing.join('\n  '))
	process.exit(1)
}

const outDir = path.resolve(webRoot, '../studio/import')
fs.mkdirSync(outDir, { recursive: true })
const out = path.join(outDir, 'data.ndjson')
fs.writeFileSync(out, docs.map((d) => JSON.stringify(d)).join('\n') + '\n')

const assets = docs.map((d) => JSON.stringify(d)).join('').match(/_sanityAsset/g)?.length ?? 0
console.log(`Wrote ${docs.length} documents and ${assets} asset references to ${path.relative(process.cwd(), out)}`)
console.log('\nNext:\n  cd apps/studio\n  npx sanity login\n  npx sanity dataset import import/data.ndjson production --replace')
