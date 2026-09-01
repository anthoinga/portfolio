import { describe, expect, it } from 'vitest'
import { parseCssColor, projectSurface, relativeLuminance, surfaceScheme } from './theme'

describe('cursor surface', () => {
	it('parses hex and rgb colors', () => {
		expect(parseCssColor('#0e1010')).toEqual([14, 16, 16])
		expect(parseCssColor('#fff')).toEqual([255, 255, 255])
		expect(parseCssColor('rgb(244, 246, 255)')).toEqual([244, 246, 255])
	})

	it('treats dark card fills as dark and pale fills as light', () => {
		expect(surfaceScheme('#0d140b')).toBe('dark')
		expect(surfaceScheme('#0e1324')).toBe('dark')
		expect(surfaceScheme('#f3f6ff')).toBe('light')
		expect(relativeLuminance('#000')!).toBeCloseTo(0, 3)
	})

	it('uses dark ink on a mint card and the darkest fill on dark cards', () => {
		expect(
			projectSurface({
				colorScheme: 'light',
				colorAccent: '#2bcf78',
				colorLight: '#45e890',
				colorDark: '#111111',
				colorDarkest: '#2fd47a'
			})
		).toEqual({ background: '#45e890', color: '#111111' })

		expect(
			projectSurface({
				colorScheme: 'dark',
				colorAccent: '#3a3a3a',
				colorLight: '#ffffff',
				colorDark: '#141414',
				colorDarkest: '#000000'
			})
		).toEqual({ background: '#000000', color: '#ffffff' })
	})
})
