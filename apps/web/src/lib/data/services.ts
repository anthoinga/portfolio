export type Service = {
	id: string
	title: string
	summary: string
	deliverables: string[]
}

export const services: Service[] = [
	{
		id: 'embed',
		title: 'Design engineering, embedded',
		summary:
			'I join your team to design and build interface work in code, so design and engineering move as one loop.',
		deliverables: ['Production-ready UI', 'Component and token work', 'Direct collaboration with your engineers']
	},
	{
		id: 'prototype',
		title: 'Interactive prototype sprint',
		summary:
			'A working prototype in a few weeks, built to test an idea with real people before you commit to building it.',
		deliverables: ['A clickable, behaving prototype', 'Usability findings', 'A recommendation on what to build']
	},
	{
		id: 'system',
		title: 'Design system foundations',
		summary: 'The starting set of tokens, components and rules a product team can keep growing.',
		deliverables: ['Tokens and core components', 'Usage documentation', 'A plan for adoption']
	},
	{
		id: 'audit',
		title: 'UX audit and research',
		summary: 'Find where an existing experience breaks down and what to fix first.',
		deliverables: ['Research and heuristic review', 'Prioritised findings', 'Concrete next steps']
	}
]
