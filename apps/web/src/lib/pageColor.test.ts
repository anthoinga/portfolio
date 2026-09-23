import { describe, expect, it } from 'vitest'
import { activePageColor, inkFor, stopAttrs } from './pageColor'

const ink = { colorLight: '#ffffff', colorDark: '#141414' }
const port = { top: 0, bottom: 800, line: 400 }

describe('page color', () => {
	it('stays on the opening color until a stop is reached', () => {
		expect(
			activePageColor(
				[
					{ top: 900, bottom: 1200, color: '#000000', when: 'reveal' },
					{ top: 2000, bottom: 2800, color: '#ededed', when: 'center' }
				],
				port,
				'#872C02'
			)
		).toBe('#872C02')
	})

	it('turns black once a paragraph has fully entered, and keeps it after that paragraph scrolls away', () => {
		const marker = { top: 200, bottom: 700, color: '#000000', when: 'reveal' as const }
		expect(activePageColor([marker], port, '#872C02')).toBe('#000000')
		expect(activePageColor([{ ...marker, top: -400, bottom: 100 }], port, '#872C02')).toBe('#000000')
	})

	it('holds the ending color until the quote reaches its line', () => {
		const quote = { top: 700, bottom: 811, color: '#872C02', when: 'enter' as const, line: 0.8 }
		expect(activePageColor([quote], port, '#ededed')).toBe('#ededed')
		expect(activePageColor([{ ...quote, top: 620, bottom: 731 }], port, '#ededed')).toBe('#872C02')
	})

	it('waits until a video center passes its line, then rust when the quote enters', () => {
		const early = { top: 50, bottom: 850, color: '#ededed', when: 'center' as const, line: 0.3 }
		expect(activePageColor([early], port, '#000000')).toBe('#000000')
		expect(activePageColor([{ ...early, top: -280, bottom: 520 }], port, '#000000')).toBe('#ededed')
	})

	it('turns light once a video center passes the middle, then rust when the quote enters', () => {
		const video = { top: 100, bottom: 900, color: '#ededed', when: 'center' as const }
		const quote = { top: 900, bottom: 1000, color: '#872C02', when: 'enter' as const }
		expect(activePageColor([video, quote], port, '#000000')).toBe('#000000')
		expect(activePageColor([{ ...video, top: -100, bottom: 700 }, quote], port, '#000000')).toBe('#ededed')
		expect(
			activePageColor([{ ...video, top: -800, bottom: 0 }, { ...quote, top: 700, bottom: 800 }], port, '#000000')
		).toBe('#872C02')
	})

	it('marks only the block a stop names', () => {
		expect(stopAttrs('f-aisle', [{ at: 'f-aisle', color: '#ededed', when: 'past' }])).toEqual({
			'data-page-color': '#ededed',
			'data-page-when': 'past'
		})
		expect(stopAttrs('f-job', [{ at: 'f-aisle', color: '#ededed', when: 'past' }])).toEqual({})
	})

	it('picks ink from the study palette at the 0.42 luminance threshold', () => {
		expect(inkFor('#872C02', ink)).toBe('#ffffff')
		expect(inkFor('#000000', ink)).toBe('#ffffff')
		expect(inkFor('#ededed', ink)).toBe('#141414')
	})
})