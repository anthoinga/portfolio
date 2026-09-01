import { createClient, type SanityClient } from '@sanity/client'
import { env as privateEnv } from '$env/dynamic/private'
import { env as publicEnv } from '$env/dynamic/public'

export function isSanityConfigured() {
	return Boolean(publicEnv.PUBLIC_SANITY_PROJECT_ID && privateEnv.SANITY_API_READ_TOKEN)
}

export function getSanityClient(): SanityClient {
	if (!isSanityConfigured()) {
		throw new Error('Sanity is not configured')
	}

	return createClient({
		projectId: publicEnv.PUBLIC_SANITY_PROJECT_ID,
		dataset: publicEnv.PUBLIC_SANITY_DATASET || 'production',
		apiVersion: publicEnv.PUBLIC_SANITY_API_VERSION || '2024-01-01',
		token: privateEnv.SANITY_API_READ_TOKEN,
		useCdn: false,
		perspective: 'published'
	})
}
