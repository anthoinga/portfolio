import type { Project, SiteSettings } from '$lib/sanity/types'

const p = (file: string, alt: string) => ({ url: `/placeholders/${file}`, alt })
const poster = (file: string, alt: string) => ({ url: `/posters/${file}`, alt })

export const siteSettingsFixture: SiteSettings = {
	name: 'Anthony Inga',
	role: 'Creative Developer',
	bio: 'A creative developer that thrives at the intersection of design and technology. Focus spans across human-computer interactions, media, and culture — out of the box tinkerer, technical when needed, total lab rat.',
	email: 'anthony@inga.dev',
	github: 'https://github.com/anthoinga',
	linkedin: 'https://www.linkedin.com/in/anthonyinga/',
	cv: '/cv.pdf',
	experiences: [
		{ org: 'Persimmony', role: 'Design Engineer' },
		{ org: '7-Eleven R&D', role: 'Sr. UX Designer' },
		{ org: 'Bottle Rocket', role: 'UX Architect' }
	],
	awards: [
		{ org: 'Visual and UX, W3 Awards', role: '2022' },
		{ org: 'Best UX Practices, W3 Awards', role: '2021' }
	]
}

const atlas: Project = {
	_id: 'proj-atlas',
	title: 'Designing for new norms',
	slug: 'atlas-kitchen',
	description: 'Voice and chat UX for a convenience retail counter.',
	tags: ['Product', 'Research', 'Prototyping'],
	type: 'case-study',
	scope: '12 weeks (2024)',
	weight: 1,
	hidden: false,
	colorScheme: 'dark',
	colorAccent: '#3a3a3a',
	colorLight: '#ffffff',
	colorDark: '#141414',
	colorDarkest: '#000000',
	poster: poster('atlas.png', 'Handheld scanner showing a retail picking workflow'),
	previewVideo: null,
	externalUrl:
		'https://anthonyi.notion.site/Designing-for-new-norms-259037de3129805b9822d688be9175ea?source=copy_link',
	body: [
		{
			_type: 'block',
			_key: 'a0',
			style: 'normal',
			markDefs: [],
			children: [
				{
					_type: 'span',
					_key: 'a0s',
					marks: [],
					text: 'A counter-side assistant for convenience retail: order, status, and help without a separate kiosk flow.'
				}
			]
		},
		{
			_type: 'layoutBlock',
			_key: 'a2',
			ratio: '2/3',
			items: [
				{
					_key: 'a2a',
					kind: 'image',
					image: p('atlas-a.svg', 'Green field with a pale bar'),
					label: '01',
					title: 'Turns',
					text: 'Short prompts, confirmation, and a way out to a human.',
					topPadding: true
				},
				{
					_key: 'a2b',
					kind: 'image',
					image: p('atlas-b.svg', 'Green field with a brighter disc'),
					label: '02',
					title: 'States',
					overlay: true
				}
			]
		},
		{
			_type: 'videoBlock',
			_key: 'a3',
			canScrub: true,
			seekOnScroll: false,
			poster: p('atlas-video.svg', 'Green field video poster'),
			file: null,
			width: 1280,
			height: 720
		},
		{
			_type: 'team',
			_key: 'a4',
			members: [
				{ name: 'Product', position: 'Direction' },
				{ name: 'Engineering', position: 'Prototype' },
				{ name: 'Research', position: 'Interviews' }
			]
		},
		{
			_type: 'listBlock',
			_key: 'a5',
			items: [
				{ label: '01', text: 'Map the existing counter script before adding a model.' },
				{ label: '02', text: 'Fail closed: unclear intent goes to staff, not a guess.' },
				{ label: '03', text: 'Log turns for QA; do not store customer audio.' }
			]
		},
		{
			_type: 'quoteBlock',
			_key: 'a6',
			text: 'If it takes longer than pointing at the screen, it will not ship.',
			who: 'Retail ops',
			title: 'Constraint'
		},
		{ _type: 'spacer', _key: 'a8' },
		{
			_type: 'block',
			_key: 'a9',
			style: 'normal',
			markDefs: [],
			children: [
				{
					_type: 'span',
					_key: 'a9s',
					marks: [],
					text: 'Coverage in the prototype: greeting, order change, out-of-stock, and handoff to staff.'
				}
			]
		}
	]
}

const night: Project = {
	_id: 'proj-night',
	title: 'Talent in your pocket',
	slug: 'night-bus',
	description: 'Shared patterns and components for public-health software.',
	tags: ['Service', 'Motion'],
	type: 'gallery',
	scope: '6 weeks (2023)',
	weight: 2,
	hidden: false,
	colorScheme: 'dark',
	colorAccent: '#f05a52',
	colorLight: '#ffffff',
	colorDark: '#8a1518',
	colorDarkest: '#d12a28',
	poster: poster('night.png', 'Mobile timesheet app on a phone'),
	previewVideo: null,
	externalUrl:
		'https://anthonyi.notion.site/Talent-in-Your-Pocket-25c037de312980b4815ef54e253f85dd?source=copy_link',
	body: [
		{
			_type: 'slideShow',
			_key: 'n1',
			label: 'System',
			text: 'Tokens, type, and a small set of task screens.',
			slides: [
				p('night-1.svg', 'Indigo field, sample 1'),
				p('night-2.svg', 'Indigo field, sample 2'),
				p('night-3.svg', 'Indigo field, sample 3')
			]
		},
		{
			_type: 'layoutBlock',
			_key: 'n2',
			ratio: '1/2',
			items: [
				{
					_key: 'n2a',
					kind: 'image',
					image: p('night-a.svg', 'Indigo field with a warm bar'),
					wideSpacing: true,
					title: 'Foundations',
					text: 'Color, type, and spacing used across program tools.'
				},
				{
					_key: 'n2b',
					kind: 'image',
					image: p('night-b.svg', 'Dark indigo field'),
					fillHeight: true
				}
			]
		},
		{
			_type: 'fullImage',
			_key: 'n3',
			image: p('night-hero.svg', 'Full-width indigo field')
		}
	]
}

const glass: Project = {
	_id: 'proj-glass',
	title: 'Demystifying coverage marketplace',
	slug: 'glass-radio',
	description: 'Interaction patterns for changing workplace and public norms.',
	tags: ['Object', 'Sound'],
	type: 'case-study',
	scope: '8 weeks (2022)',
	weight: 3,
	hidden: false,
	colorScheme: 'light',
	colorAccent: '#2bcf78',
	colorLight: '#45e890',
	colorDark: '#111111',
	colorDarkest: '#2fd47a',
	poster: poster('glass.png', 'Insurance quote dashboard on a desktop monitor'),
	previewVideo: null,
	externalUrl:
		'https://anthonyi.notion.site/Demystifying-coverage-marketplace-257037de31298000bd68fa954cb48ec1?source=copy_link',
	body: [
		{
			_type: 'block',
			_key: 'g0',
			style: 'normal',
			markDefs: [],
			children: [
				{
					_type: 'span',
					_key: 'g0s',
					marks: [],
					text: 'Workshops and prototypes on how tools should behave when the social rules around them shift.'
				}
			]
		},
		{
			_type: 'videoBlock',
			_key: 'g1',
			canScrub: false,
			seekOnScroll: true,
			poster: p('glass-video.svg', 'Pale field video poster'),
			file: null
		},
		{
			_type: 'quoteBlock',
			_key: 'g3',
			text: 'The default should match the new rule, not the old habit.',
			who: 'Workshop note',
			title: 'Norms'
		},
		{
			_type: 'listBlock',
			_key: 'g4',
			items: [
				{ label: 'A', text: 'Name the old default and who it served.' },
				{ label: 'B', text: 'Ship the new default with an explicit override.' }
			]
		}
	]
}

const field: Project = {
	_id: 'proj-field',
	title: 'Reading at the speed of thought',
	slug: 'field-notes',
	description: 'A compact talent product for phone-sized sessions.',
	tags: ['Editorial'],
	type: 'blank',
	scope: '4 weeks (2021)',
	weight: 4,
	hidden: false,
	colorScheme: 'dark',
	colorAccent: '#3a3a3a',
	colorLight: '#ffffff',
	colorDark: '#141414',
	colorDarkest: '#000000',
	poster: poster('field.jpg', 'AI reading app on a phone'),
	previewVideo: null,
	externalUrl:
		'https://anthonyi.notion.site/Reading-at-the-Speed-of-Thought-30b037de312980d0b826e6b89511a157?source=copy_link',
	body: [
		{ _type: 'spacer', _key: 'f0' },
		{
			_type: 'fullImage',
			_key: 'f1',
			image: p('field-hero.svg', 'Warm paper field')
		},
		{
			_type: 'quoteBlock',
			_key: 'f2',
			text: 'One primary action per screen; the rest lives one tap back.',
			who: 'Product note'
		}
	]
}

const hidden: Project = {
	_id: 'proj-hidden',
	title: 'Hidden Archive',
	slug: 'hidden-archive',
	description: 'Unlisted studies, kept for old links.',
	tags: ['Archive'],
	type: 'blank',
	scope: 'Ongoing',
	weight: 99,
	hidden: true,
	colorScheme: 'dark',
	colorAccent: '#c9a0d8',
	colorLight: '#efe6f4',
	colorDark: '#2a1d30',
	colorDarkest: '#140e18',
	poster: p('hidden.svg', 'Muted plum field'),
	previewVideo: null,
	body: [
		{
			_type: 'fullImage',
			_key: 'h1',
			image: p('hidden-hero.svg', 'Muted plum field')
		}
	]
}

atlas.nextProject = {
	_id: night._id,
	title: night.title,
	slug: night.slug,
	hidden: night.hidden,
	weight: night.weight,
	colorScheme: night.colorScheme,
	colorAccent: night.colorAccent,
	colorLight: night.colorLight,
	colorDark: night.colorDark,
	colorDarkest: night.colorDarkest,
	poster: night.poster
}

night.nextProject = {
	_id: glass._id,
	title: glass.title,
	slug: glass.slug,
	hidden: glass.hidden,
	weight: glass.weight,
	colorScheme: glass.colorScheme,
	colorAccent: glass.colorAccent,
	colorLight: glass.colorLight,
	colorDark: glass.colorDark,
	colorDarkest: glass.colorDarkest,
	poster: glass.poster
}

glass.nextProject = {
	_id: field._id,
	title: field.title,
	slug: field.slug,
	hidden: field.hidden,
	weight: field.weight,
	colorScheme: field.colorScheme,
	colorAccent: field.colorAccent,
	colorLight: field.colorLight,
	colorDark: field.colorDark,
	colorDarkest: field.colorDarkest,
	poster: field.poster
}

field.nextProject = {
	_id: atlas._id,
	title: atlas.title,
	slug: atlas.slug,
	hidden: atlas.hidden,
	weight: atlas.weight,
	colorScheme: atlas.colorScheme,
	colorAccent: atlas.colorAccent,
	colorLight: atlas.colorLight,
	colorDark: atlas.colorDark,
	colorDarkest: atlas.colorDarkest,
	poster: atlas.poster
}

export const projectsFixture: Project[] = [atlas, night, glass, field, hidden]
