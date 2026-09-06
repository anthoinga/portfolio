import { describe, expect, it } from 'vitest'
import { projectsFixture } from './fixtures'

describe('visible fixture cards', () => {
	const visible = () =>
		projectsFixture.filter((p) => !p.hidden).sort((a, b) => a.weight - b.weight)

	it('are ordered conversational, curbside, aviator, talent', () => {
		expect(visible().map((p) => p.title)).toEqual([
			'Conversational Convenience',
			'Curbside Pickup',
			'Aviator',
			'Talent'
		])
	})

	it('omit a link on coming soon; others have http(s)', () => {
		const cards = visible()
		expect(cards[0]?.externalUrl).toBeUndefined()
		for (const project of cards.slice(1)) {
			expect(project.externalUrl, project.slug).toMatch(/^https?:\/\//)
		}
	})
})
