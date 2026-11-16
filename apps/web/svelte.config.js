import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'
import adapter from '@sveltejs/adapter-static'
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'
import { loadEnv } from 'vite'

// The inline scripts in app.html (theme before paint, intro shell) are not
// hashed by SvelteKit, so hash them here. Editing them updates the hash.
const appHtml = readFileSync(new URL('./src/app.html', import.meta.url), 'utf8')
const inlineScriptHashes = [...appHtml.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(
	(m) => `sha256-${createHash('sha256').update(m[1]).digest('base64')}`
)

// The enquiry form posts to PUBLIC_FORM_ENDPOINT when it is set (a form service such as Formspree).
// That origin is allowed in the CSP only then; unset, the form sends nothing and the CSP stays tight.
const formEndpoint = process.env.PUBLIC_FORM_ENDPOINT || loadEnv('production', process.cwd(), '').PUBLIC_FORM_ENDPOINT
let formOrigin = null
try {
	if (formEndpoint) formOrigin = new URL(formEndpoint).origin
} catch {
	/* not a URL: ignore it here, the form will fail visibly instead of loosening the policy */
}

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter({
			pages: 'build',
			assets: 'build',
			// Vercel serves build/404.html for unknown paths (with status 404).
			fallback: '404.html',
			precompress: true,
			strict: true
		}),
		// Prerendered pages get this as a <meta> tag with hashes for SvelteKit's own inline
		// scripts. frame-ancestors can't live in a meta tag, so vercel.json sends it as a header.
		csp: {
			mode: 'auto',
			directives: {
				'default-src': ['self'],
				'script-src': ['self', ...inlineScriptHashes],
				// Svelte and the design tokens use inline style attributes throughout.
				'style-src': ['self', 'unsafe-inline'],
				'img-src': ['self', 'data:', 'https://cdn.sanity.io'],
				'media-src': ['self', 'blob:', 'https://cdn.sanity.io'],
				'font-src': ['self', 'data:'],
				'connect-src': ['self', ...(formOrigin ? [formOrigin] : [])],
				'object-src': ['none'],
				'base-uri': ['self'],
				'form-action': ['self']
			}
		}
	}
}

export default config
