/**
 * Home page copy. Shaped like the `homePage` document the studio gets in the
 * Sanity phase, so moving it there is a copy-paste.
 */
export const homeCopy = {
	status: 'Open to design-engineering roles',
	headline: 'I design it.\nThen I build it.',
	lead: 'A creative developer working where design and technology meet: human-computer interaction, media and culture. Technical when it needs to be.',
	ctaPrimary: 'See the work',
	ctaSecondary: 'Get in touch',
	work: { label: 'Selected work', all: 'All work' },
	playground: {
		label: 'Playground',
		title: 'Small things I build to learn how an interface should feel.',
		all: 'Open the playground'
	},
	principles: {
		label: 'How I work',
		items: [
			{
				title: 'Design in the medium',
				body: 'I get to something that moves early, so decisions are made on the real thing instead of a picture of it.'
			},
			{
				title: 'Prototype to learn',
				body: 'Research and prototypes feed each other. A rough build that answers a question beats a polished one that does not.'
			},
			{
				title: 'Ship the system',
				body: 'The goal is not one good screen. It is a set of decisions a team can keep building on after I have left the room.'
			}
		]
	},
	cta: {
		title: 'Have something to build?',
		body: 'Whether it is a role, a prototype or a product that needs a clearer shape, I would like to hear about it.',
		primary: 'Work with me',
		secondary: 'Contact'
	}
} as const
