import { sveltekit } from '@sveltejs/kit/vite'
import tailwindcss from '@tailwindcss/vite'
import { imagetools } from 'vite-imagetools'
import { defineConfig } from 'vite'

export default defineConfig({
	plugins: [
		tailwindcss(),
		sveltekit(),
		// Resizes and converts bundled images at build time (`?w=…&format=webp`). The Sanity
		// export script turns it off so it can see the original files.
		...(process.env.CONTENT_TOOLING ? [] : [imagetools()])
	]
})
