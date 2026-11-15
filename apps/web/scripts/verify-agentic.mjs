#!/usr/bin/env node
/**
 * Checks the agent-readable surface of the site against a running URL.
 *
 *   node apps/web/scripts/verify-agentic.mjs https://inga.dev
 *   node apps/web/scripts/verify-agentic.mjs http://127.0.0.1:4173 --direct
 *
 * `--direct` skips the checks that depend on Vercel rewrites/headers
 * (Accept negotiation, extensionless /api/v1/x, response headers), so the same
 * script can run in CI against `vite preview`.
 */
const args = process.argv.slice(2)
const base = (args.find((a) => !a.startsWith('--')) ?? 'http://127.0.0.1:4173').replace(/\/$/, '')
const direct = args.includes('--direct')
const RESOURCES = ['profile', 'experience', 'skills', 'projects', 'playground', 'services']
const PAGES = ['index', 'playground', 'skills', 'work-with-me', 'developers']

let failed = 0
let passed = 0
const ok = (name) => {
	passed++
	console.log(`  ✔ ${name}`)
}
const bad = (name, why) => {
	failed++
	console.log(`  ✘ ${name}\n      ${why}`)
}
async function check(name, fn) {
	try {
		const why = await fn()
		if (why) bad(name, why)
		else ok(name)
	} catch (e) {
		bad(name, e instanceof Error ? e.message : String(e))
	}
}
const get = (path, init) => fetch(`${base}${path}`, { redirect: 'follow', ...init })
const text = async (path, init) => {
	const r = await get(path, init)
	if (!r.ok) throw new Error(`${path} → HTTP ${r.status}`)
	return { r, body: await r.text() }
}

console.log(`Verifying ${base}${direct ? ' (direct mode)' : ''}\n`)

console.log('llms.txt')
for (const [path, heading] of [
	['/llms.txt', '## When to use this'],
	['/es/llms.txt', '## Cuándo usar esto']
]) {
	await check(`${path} has the "${heading}" section`, async () => {
		const { r, body } = await text(path)
		if (!direct && !(r.headers.get('content-type') ?? '').startsWith('text/plain')) {
			return `content-type is ${r.headers.get('content-type')}`
		}
		if (!body.startsWith('# ')) return 'does not start with an H1'
		if (!body.includes(heading)) return `missing "${heading}"`
	})
}

console.log('\nMarkdown twins')
const sitemap = (await text('/sitemap.xml').catch(() => ({ body: '' }))).body
const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname)
await check('sitemap lists pages in both languages', () => {
	if (locs.length < 12) return `only ${locs.length} URLs`
	if (!locs.some((p) => p.startsWith('/es'))) return 'no /es URLs'
})
for (const path of locs) {
	const md = path === '/' ? '/index.md' : path === '/es' ? '/es/index.md' : `${path}.md`
	await check(`${md} has front-matter`, async () => {
		const { body } = await text(md)
		if (!body.startsWith('---\n')) return 'no front-matter'
		for (const key of ['title:', 'description:', 'canonical:', 'last-updated:', 'language:']) {
			if (!body.includes(`\n${key}`)) return `front-matter missing ${key}`
		}
	})
}
await check('every Markdown page name is covered by the sitemap', () => {
	const missing = PAGES.filter((p) => p !== 'developers').filter(
		(p) => !locs.includes(p === 'index' ? '/' : `/${p}`)
	)
	if (missing.length) return `not in sitemap: ${missing.join(', ')}`
})

if (!direct) {
	console.log('\nContent negotiation (needs the Vercel rewrites)')
	for (const path of ['/', '/skills', '/es/skills', locs.find((p) => p.includes('/projects/')) ?? '/skills']) {
		await check(`Accept: text/markdown on ${path}`, async () => {
			const { r, body } = await text(path, { headers: { accept: 'text/markdown' } })
			if (!(r.headers.get('content-type') ?? '').includes('markdown')) {
				return `content-type is ${r.headers.get('content-type')}`
			}
			if (!body.startsWith('---')) return 'body is not Markdown with front-matter'
		})
	}
	await check('a browser Accept header still gets HTML', async () => {
		const { r } = await text('/skills', { headers: { accept: 'text/html' } })
		if (!(r.headers.get('content-type') ?? '').includes('html')) return `got ${r.headers.get('content-type')}`
	})
	await check('/?mode=agent returns Markdown', async () => {
		const { body } = await text('/?mode=agent')
		if (!body.startsWith('---')) return 'not Markdown'
	})
}

console.log('\nJSON API')
for (const r of RESOURCES) {
	await check(`/api/v1/${r}.json is an enveloped v1 response`, async () => {
		const { body } = await text(`/api/v1/${r}.json`)
		const j = JSON.parse(body)
		if (j.apiVersion !== 'v1') return `apiVersion is ${j.apiVersion}`
		if (j.data == null) return 'no data'
		if (j.meta?.resource !== r) return `meta.resource is ${j.meta?.resource}`
	})
}
await check('Spanish API reports lang es-PE', async () => {
	const j = JSON.parse((await text('/es/api/v1/profile.json')).body)
	if (j.meta?.lang !== 'es-PE') return `meta.lang is ${j.meta?.lang}`
})
await check('profile names the person and links to them', async () => {
	const j = JSON.parse((await text('/api/v1/profile.json')).body)
	if (!j.data.name) return 'no name'
	if (!j.data.links?.email) return 'no email'
})
if (!direct) {
	await check('/api/v1/profile works without an extension', async () => {
		const j = JSON.parse((await text('/api/v1/profile')).body)
		if (j.apiVersion !== 'v1') return 'not v1'
	})
	await check('/api/v1/profile?lang=es returns Spanish', async () => {
		const j = JSON.parse((await text('/api/v1/profile?lang=es')).body)
		if (j.meta?.lang !== 'es-PE') return `meta.lang is ${j.meta?.lang}`
	})
	await check('/.well-known/api-catalog is a linkset', async () => {
		const { r, body } = await text('/.well-known/api-catalog')
		if (!(r.headers.get('content-type') ?? '').includes('linkset+json')) return `content-type ${r.headers.get('content-type')}`
		if (!JSON.parse(body).linkset) return 'no linkset'
	})
}

console.log('\nOpenAPI')
await check('openapi.json is 3.1 and every operation is described', async () => {
	const spec = JSON.parse((await text('/openapi.json')).body)
	if (!spec.openapi?.startsWith('3.1')) return `openapi is ${spec.openapi}`
	for (const r of RESOURCES) {
		const op = spec.paths?.[`/api/v1/${r}`]?.get
		if (!op) return `missing /api/v1/${r}`
		if (!op.operationId || !op.description) return `/api/v1/${r} lacks operationId or description`
	}
	if (!spec.components?.schemas?.Problem) return 'no Problem schema'
})
await check('api-catalog file exists', async () => {
	const { body } = await text('/.well-known/api-catalog')
	if (!JSON.parse(body).linkset?.[0]?.['service-desc']) return 'no service-desc'
})

console.log('\nPages')
await check('home page has parseable JSON-LD with a Person and hreflang links', async () => {
	const { body } = await text('/')
	const m = body.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)
	if (!m) return 'no JSON-LD'
	const graph = JSON.parse(m[1])['@graph'] ?? []
	if (!graph.some((n) => n['@type'] === 'Person')) return 'no Person node'
	if ((body.match(/rel="alternate" hreflang=/g) ?? []).length < 3) return 'fewer than 3 hreflang links'
	if (!body.includes('rel="llms"')) return 'no <link rel="llms">'
	if (!body.includes('type="text/markdown"')) return 'no markdown alternate'
})
await check('Spanish home is marked es-PE', async () => {
	const { body } = await text('/es')
	if (!/<html[^>]*lang="es-PE"/.test(body)) return 'html lang is not es-PE'
})
await check('robots.txt names AI crawlers and the sitemap', async () => {
	const { body } = await text('/robots.txt')
	for (const want of ['GPTBot', 'ClaudeBot', 'PerplexityBot', 'Sitemap:']) {
		if (!body.includes(want)) return `missing ${want}`
	}
})
await check('unknown paths return a real 404', async () => {
	const r = await get('/definitely-not-a-page')
	if (r.status !== 404) return `got HTTP ${r.status}`
})

console.log(`\n${passed} passed, ${failed} failed`)
process.exit(failed ? 1 : 0)
