import { describe, expect, it } from 'vitest'
import { projectsFixture } from './fixtures'

describe('visible fixture cards', () => {
	const visible = () =>
		projectsFixture.filter((p) => !p.hidden).sort((a, b) => a.weight - b.weight)

	it('are ordered conversational, curbside, aviator, talent', () => {
		expect(visible().map((p) => p.title)).toEqual([
			'Conversational Convenience',
			'Curbside Pickup',
			'Insurance Aggregator',
			'Talent Marketplace',
		])
	})

	it('give every visible card a slug', () => {
		for (const project of visible()) {
			expect(project.slug).toBeTruthy()
		}
	})
})
