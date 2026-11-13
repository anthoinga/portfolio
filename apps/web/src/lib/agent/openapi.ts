import { API_RESOURCES } from '../../params/apiresource'
import { resourceSummary } from './developers'

/** OpenAPI 3.1 description of the read-only API. Built from the same resource list as the routes. */
export function openApi(base: string, author: string) {
	const langParam = {
		name: 'lang',
		in: 'query',
		required: false,
		description: 'Content language. Defaults to English.',
		schema: { type: 'string', enum: ['en', 'es'], default: 'en' }
	}
	const paths = Object.fromEntries(
		API_RESOURCES.map((r) => [
			`/api/v1/${r}`,
			{
				get: {
					operationId: `get${r[0].toUpperCase()}${r.slice(1)}`,
					summary: resourceSummary(r, 'en'),
					description: `${resourceSummary(r, 'en')} Also served as static files at /api/v1/${r}.json (English) and /es/api/v1/${r}.json (Spanish).`,
					parameters: [langParam],
					responses: {
						'200': {
							description: 'Success',
							content: { 'application/json': { schema: { $ref: '#/components/schemas/Envelope' } } }
						},
						'404': {
							description: 'Unknown resource',
							content: { 'application/problem+json': { schema: { $ref: '#/components/schemas/Problem' } } }
						}
					}
				}
			}
		])
	)
	return {
		openapi: '3.1.0',
		info: {
			title: `${author} — portfolio API`,
			version: '1.0.0',
			description:
				'Read-only, public, no authentication. The site is static and rebuilt on every deploy, so responses are current as of the last deploy. Additive changes happen in place; clients must ignore unknown fields. Breaking changes would ship under /api/v2.'
		},
		servers: [{ url: base }],
		paths,
		components: {
			schemas: {
				Envelope: {
					type: 'object',
					required: ['apiVersion', 'data', 'meta'],
					properties: {
						apiVersion: { type: 'string', const: 'v1' },
						data: { description: 'Resource-specific payload.' },
						meta: {
							type: 'object',
							properties: {
								resource: { type: 'string' },
								lang: { type: 'string', enum: ['en', 'es-PE'] },
								canonical: { type: 'string', format: 'uri' },
								generatedAt: { type: 'string', format: 'date-time' }
							}
						}
					}
				},
				Problem: {
					type: 'object',
					description: 'RFC 9457 problem details.',
					properties: {
						type: { type: 'string' },
						title: { type: 'string' },
						status: { type: 'integer' },
						detail: { type: 'string' }
					}
				}
			}
		}
	}
}
