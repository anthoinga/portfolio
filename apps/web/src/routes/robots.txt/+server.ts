import { siteUrl } from '$lib/server/site'
import type { RequestHandler } from './$types'

export const prerender = true

/** Crawlers that read the web for AI products. Named explicitly so the policy is unambiguous. */
const AI_CRAWLERS = [
	'GPTBot',
	'OAI-SearchBot',
	'ChatGPT-User',
	'ClaudeBot',
	'Claude-User',
	'Claude-SearchBot',
	'PerplexityBot',
	'Google-Extended',
	'Applebot-Extended',
	'CCBot'
]

export const GET: RequestHandler = async () => {
	const body = [
		'# This site is meant to be read, by people and by agents. See /llms.txt and /developers.',
		'User-agent: *',
		'Allow: /',
		'',
		...AI_CRAWLERS.flatMap((ua) => [`User-agent: ${ua}`, 'Allow: /', '']),
		`Sitemap: ${siteUrl}/sitemap.xml`,
		''
	].join('\n')
	return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } })
}
