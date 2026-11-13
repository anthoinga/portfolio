export type SkillGroup = {
	id: string
	title: string
	summary: string
	skills: string[]
	/** Case studies (by slug) that show this skill in use. */
	proof: { slug: string; label: string }[]
}

export const skillGroups: SkillGroup[] = [
	{
		id: 'product-design',
		title: 'Product design',
		summary:
			'Turning an unclear problem into flows, screens and a model a team can build against.',
		skills: ['Interaction design', 'Information architecture', 'Flows & wireframes', 'Product thinking'],
		proof: [
			{ slug: 'curbside', label: 'Curbside Pickup' },
			{ slug: 'talent', label: 'Talent Marketplace' }
		]
	},
	{
		id: 'research',
		title: 'Research & synthesis',
		summary: 'Learning from the people and places the product lives in before drawing anything.',
		skills: ['Field research', 'Interviews', 'Usability testing', 'Synthesis'],
		proof: [
			{ slug: 'curbside', label: 'Curbside Pickup' },
			{ slug: 'insurance', label: 'Insurance Aggregator' }
		]
	},
	{
		id: 'prototyping',
		title: 'Prototyping',
		summary: 'Building something that behaves like the real thing, early enough to learn from it.',
		skills: ['Interactive prototypes', 'Conversational interfaces', 'Rapid iteration', 'Usability sessions'],
		proof: [{ slug: 'convenience', label: 'Conversational Convenience' }]
	},
	{
		id: 'systems',
		title: 'Design systems',
		summary: 'Reusable decisions: tokens, components and the rules for using them.',
		skills: ['Design tokens', 'Component libraries', 'Documentation', 'Handoff'],
		proof: [
			{ slug: 'talent', label: 'Talent Marketplace' },
			{ slug: 'insurance', label: 'Insurance Aggregator' }
		]
	},
	{
		id: 'front-end',
		title: 'Front-end engineering',
		summary: 'Shipping the interface in code, including the parts that only exist in motion.',
		skills: ['Svelte & SvelteKit', 'TypeScript', 'Tailwind CSS', 'Canvas & Web Audio', 'Accessibility'],
		proof: [{ slug: '/playground', label: 'This site and the Playground' }]
	},
	{
		id: 'motion',
		title: 'Motion & interaction',
		summary: 'Hand-built transitions, scroll behaviour and feedback that make an interface feel considered.',
		skills: ['Scroll-driven motion', 'Shared-element transitions', 'Micro-interactions', 'Sound design'],
		proof: [{ slug: '/playground', label: 'Playground' }]
	}
]
