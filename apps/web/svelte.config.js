import adapter from '@sveltejs/adapter-static'
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'

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
		})
	}
}

export default config
