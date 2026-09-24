import { env } from '$env/dynamic/public'

function vercelOrigin() {
	const preferred =
		process.env.VERCEL_ENV === 'production'
			? process.env.VERCEL_PROJECT_PRODUCTION_URL
			: process.env.VERCEL_URL
	const host = (preferred || process.env.VERCEL_URL || '').trim().replace(/^https?:\/\//, '')
	return host ? `https://${host}` : ''
}

function readSiteUrl() {
	const raw = env.PUBLIC_SITE_URL?.trim() || vercelOrigin()
	if (!raw) {
		throw new Error('PUBLIC_SITE_URL is required. Set it in apps/web/.env (see .env.example).')
	}
	const base = raw.replace(/\/$/, '')
	if (
		process.env.VERCEL_ENV === 'production' &&
		/(?:^|\/\/)(?:localhost|127\.0\.0\.1)(?::|$)/i.test(base)
	) {
		throw new Error(
			'PUBLIC_SITE_URL must be the production origin (e.g. https://inga.dev) on Vercel production builds.'
		)
	}
	return base
}

export const siteUrl = readSiteUrl()

export function absoluteUrl(pathOrUrl: string, base = siteUrl) {
	if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl
	const path = pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`
	return `${base}${path}`
}
