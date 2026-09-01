import { describe, expect, it } from 'vitest'
import { projectsFixture } from './fixtures'

describe('visible fixture cards', () => {
	it('have an http(s) externalUrl', () => {
		const visible = projectsFixture.filter((p) => !p.hidden)
		expect(visible.length).toBeGreaterThan(0)
		for (const project of visible) {
			expect(project.externalUrl, project.slug).toMatch(/^https?:\/\//)
		}
	})
})
