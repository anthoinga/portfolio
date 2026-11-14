import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createServer } from 'vite'

export const webRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')

/**
 * Loads TypeScript modules through Vite (so `$lib` aliases and `?url` imports
 * resolve exactly as they do in the app) and returns the requested exports.
 */
export async function loadModules(...ids) {
	process.env.CONTENT_TOOLING = '1' // read by vite.config.ts
	const server = await createServer({
		root: webRoot,
		appType: 'custom',
		logLevel: 'error',
		// One-off script: no dependency pre-bundling, no file watching.
		optimizeDeps: { noDiscovery: true, include: [] },
		server: { middlewareMode: true, hmr: false, watch: null }
	})
	try {
		const mods = []
		for (const id of ids) mods.push(await server.ssrLoadModule(id))
		return mods
	} finally {
		await server.close()
	}
}
