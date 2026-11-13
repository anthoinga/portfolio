#!/usr/bin/env node
/**
 * Offline proof that the Sanity side matches the site: builds the Sanity
 * documents from the fixtures, runs the REAL GROQ queries (src/lib/server/
 * queries.ts) over them with groq-js, and checks the result still contains
 * everything the fixtures say. No network, no Sanity account.
 *
 *   pnpm --filter web verify:sanity
 */
import { evaluate, parse } from 'groq-js'
import { buildDocuments } from './lib/sanity-docs.mjs'
import { loadModules } from './lib/load-content.mjs'

const [fixtures, queries] = await loadModules('/src/lib/data/fixtures.ts', '/src/lib/server/queries.ts')

// Synthetic asset documents, so `asset->url` dereferences like it does in Sanity.
const assetDocs = new Map()
function asset(url, kind) {
	const id = `${kind}-${assetDocs.size}`
	assetDocs.set(id, { _id: id, _type: kind === 'image' ? 'sanity.imageAsset' : 'sanity.fileAsset', url })
	return { _type: 'reference', _ref: id }
}
const base = buildDocuments({
	settings: fixtures.siteSettingsFixture,
	settingsEs: fixtures.siteSettingsEs,
	projects: fixtures.projectsFixture,
	asset
})
const dataset = [...base, ...assetDocs.values()]

async function run(query, params) {
	const tree = parse(query, { params })
	return (await evaluate(tree, { dataset, params })).get()
}

let failed = 0
const fail = (msg) => {
	failed++
	console.log(`  ✘ ${msg}`)
}
const pass = (msg) => console.log(`  ✔ ${msg}`)

/** Everything in `expected` must be present and equal in `actual`; extra keys in `actual` are fine. */
function subset(expected, actual, at, out) {
	if (expected && typeof expected === 'object' && !Array.isArray(expected)) {
		if (!actual || typeof actual !== 'object') return out.push(`${at}: expected an object, got ${JSON.stringify(actual)}`)
		for (const k of Object.keys(expected)) subset(expected[k], actual[k], `${at}.${k}`, out)
	} else if (Array.isArray(expected)) {
		if (!Array.isArray(actual)) return out.push(`${at}: expected an array, got ${JSON.stringify(actual)?.slice(0, 60)}`)
		if (expected.length !== actual.length) out.push(`${at}: expected ${expected.length} items, got ${actual.length}`)
		expected.forEach((e, i) => subset(e, actual[i], `${at}[${i}]`, out))
	} else if (expected !== actual && !((expected == null || expected === '') && (actual == null || actual === ''))) {
		out.push(`${at}: expected ${JSON.stringify(expected)?.slice(0, 70)}, got ${JSON.stringify(actual)?.slice(0, 70)}`)
	}
}

console.log('Site settings')
for (const lang of ['en', 'es']) {
	const got = await run(queries.siteSettingsQuery, { lang })
	const want = lang === 'es' ? { ...fixtures.siteSettingsFixture, ...fixtures.siteSettingsEs } : fixtures.siteSettingsFixture
	const diffs = []
	subset(want, got, 'settings', diffs)
	diffs.length ? diffs.forEach((d) => fail(`[${lang}] ${d}`)) : pass(`[${lang}] settings round-trip`)
}

console.log('\nProjects')
for (const lang of ['en', 'es']) {
	const got = await run(queries.allProjectsQuery, { lang })
	if (got.length !== fixtures.projectsFixture.length) {
		fail(`[${lang}] expected ${fixtures.projectsFixture.length} projects, got ${got.length}`)
		continue
	}
	for (const want of fixtures.projectsFixture) {
		const have = got.find((p) => p.slug === want.slug)
		if (!have) {
			fail(`[${lang}] ${want.slug} is missing`)
			continue
		}
		const diffs = []
		subset(want, have, want.slug, diffs)
		if (diffs.length) {
			fail(`[${lang}] ${want.slug}: ${diffs.length} difference(s)`)
			diffs.slice(0, 8).forEach((d) => console.log(`        ${d}`))
		} else pass(`[${lang}] ${want.slug} (${want.body.length} blocks) round-trips`)
	}
}

console.log('\nSpanish overrides')
{
	// Add Spanish fields to one document and check they win in es and are ignored in en.
	const idx = dataset.findIndex((d) => d._type === 'project')
	const original = dataset[idx]
	dataset[idx] = {
		...original,
		descriptionEs: 'Tagline en español',
		scopeEs: '12 semanas (2024)',
		briefEs: { paragraphs: ['Resumen en español'], facts: [{ _type: 'fact', _key: 'f', label: 'Tipo', items: ['App móvil'] }] },
		bodyEs: [{ _type: 'block', _key: 'es1', style: 'normal', markDefs: [], children: [{ _type: 'span', _key: 's', marks: [], text: 'Cuerpo en español' }] }]
	}
	const es = (await run(queries.allProjectsQuery, { lang: 'es' })).find((p) => p._id === original._id)
	const en = (await run(queries.allProjectsQuery, { lang: 'en' })).find((p) => p._id === original._id)
	const check = (cond, msg) => (cond ? pass(msg) : fail(msg))
	check(es.description === 'Tagline en español' && es.scope === '12 semanas (2024)', 'es uses descriptionEs and scopeEs')
	check(es.brief.paragraphs[0] === 'Resumen en español' && es.brief.facts[0].label === 'Tipo', 'es uses briefEs')
	check(es.body.length === 1 && es.body[0].children[0].text === 'Cuerpo en español', 'es uses bodyEs')
	check(en.description !== 'Tagline en español' && en.body.length > 1, 'en ignores the Spanish fields')
	dataset[idx] = { ...original, descriptionEs: undefined }
	const fallback = (await run(queries.allProjectsQuery, { lang: 'es' })).find((p) => p._id === original._id)
	check(fallback.description === original.description && fallback.body.length === original.body.length, 'es falls back to English when Spanish is empty')
}

console.log(failed ? `\n${failed} problem(s)` : '\nAll good: queries, schema shape and content agree.')
process.exit(failed ? 1 : 0)
