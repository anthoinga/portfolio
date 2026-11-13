import type { UiDemoId } from './uiDemos'

export type PlaygroundNote = {
	id: UiDemoId
	note: string
	testing: string
	stack: string[]
}

/** Notes shown next to each experiment on /playground. */
export const playgroundNotes: PlaygroundNote[] = [
	{
		id: 'dither',
		note: 'A card that renders its image through a Bayer dither on a canvas and opens up when you press it.',
		testing: 'How much texture can an image lose before it stops feeling premium?',
		stack: ['Canvas 2D', 'Svelte 5']
	},
	{
		id: 'dock',
		note: 'A dock-style navigation with a resources submenu that grows out of the bar.',
		testing: 'Can a nav bar feel physical without getting in the way of the content behind it?',
		stack: ['CSS', 'Svelte 5']
	},
	{
		id: 'weather',
		note: 'A small forecast widget that expands in place to show the rest of the day.',
		testing: 'How little chrome does a glanceable widget need to still be tappable?',
		stack: ['CSS', 'Svelte 5']
	},
	{
		id: 'tmb',
		note: 'A menu interaction recorded as a short loop. The live version is on this site.',
		testing: 'Whether motion alone can explain a menu without a single label.',
		stack: ['Svelte 5', 'Video']
	}
]
