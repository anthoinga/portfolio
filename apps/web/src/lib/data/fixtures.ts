import accuPick from '$lib/assets/cover-art/AccuPick.png?url'
import aviator from '$lib/assets/cover-art/Aviator.png?url'
import convConv from '$lib/assets/cover-art/ConConv.png?url'
import talentCover from '$lib/assets/cover-art/RH.png?url'
import type { Project, SiteSettings } from '$lib/sanity/types'

const poster = (url: string, alt: string) => ({ url, alt })
const conv = (file: string, alt: string) => ({ url: `/projects/convenience/${file}`, alt })
const curb = (file: string, alt: string) => ({ url: `/projects/curbside/${file}`, alt })
const insure = (file: string, alt: string) => ({ url: `/projects/insurance/${file}`, alt })
const tal = (file: string, alt: string) => ({ url: `/projects/talent/${file}`, alt })

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

const curbside: Project = {
	_id: 'proj-curbside',
	title: 'Curbside Pickup',
	slug: 'curbside',
	description: 'One fulfillment process for pickup that had outgrown the curb.',
	tags: ['Product', 'Research', 'Prototyping'],
	type: 'case-study',
	scope: '12 weeks (2024)',
	year: 2023,
	weight: 2,
	hidden: false,
	colorScheme: 'dark',
	colorAccent: '#3a3a3a',
	colorLight: '#ffffff',
	colorDark: '#141414',
	colorDarkest: '#000000',
	pageColor: '#16286F',
	colorStops: [
		{ at: 'c-problem', color: '#000000', when: 'reveal' },
		{ at: 'c-product', color: '#ededed', when: 'center', line: 0.3 },
		{ at: 'c-quote', color: '#16286F', when: 'enter', line: 0.8 }
	],
	poster: poster(accuPick, 'Handheld scanner showing a retail picking workflow'),
	previewVideo: null,
	brief: {
		paragraphs: [
			'A national grocer\'s pickup and delivery volume had outgrown what its curbside teams could keep up with.',
			'What used to be a convenience had become an expectation, and the fulfillment process behind it was fragmented, different from store to store.'
		],
		facts: [
			{ label: 'Project type', items: ['Android Mobile App'] },
			{
				label: 'Resources',
				items: ['2 Designers', '2 Architects', '1 Business Analyst', '1 Project Manager', '4 Engineers']
			},
			{
				label: 'Stakeholders',
				items: ['Product Owner', 'Chief Tech Officer', 'Chief Mark Officer', 'Regional Managers']
			},
			{ label: 'Timeline', items: ["Jan 22' - Apr 23'"] }
		]
	},
	seoDescription:
		'A case study on the on-device app that standardized curbside picking, staging, and handoff for a national grocer.',
	externalUrl:
		'https://app.notion.com/p/anthonyi/Designing-for-new-norms-259037de3129805b9822d688be9175ea?v=257037de312980cdac76000ce32240a1&source=copy_link',
	body: [
		{
			_type: 'layoutBlock',
			_key: 'c-open',
			ratio: '2/1',
			items: [
				{
					_key: 'c-open-scope',
					kind: 'copy',
					paragraphs: [
						'A national grocer\'s pickup and delivery volume had outgrown what its curbside teams could keep up with. What used to be a convenience had become an expectation, and the fulfillment process behind it was fragmented, different from store to store. This case study covers the on-device mobile app built to bring order to that process, and the edge-case work that followed once the core system was in place.'
					]
				},
				{
					_key: 'c-open-a',
					kind: 'image',
					image: curb('1.1.png', 'Phone showing a pandemic magazine cover, flanked by curbside pickup news clips'),
					label: '01',
					title: 'The expectation',
					text: 'Pickup went from a convenience to the default.'
				}
			]
		},
		{
			_type: 'block',
			_key: 'c-h-backbone',
			style: 'h2',
			markDefs: [],
			children: [{ _type: 'span', _key: 'c-h-backbone-s', marks: [], text: 'Establishing the Backbone' }]
		},
		{
			_type: 'block',
			_key: 'c-problem',
			style: 'normal',
			markDefs: [],
			children: [
				{
					_type: 'span',
					_key: 'c-problem-s',
					marks: [],
					text: 'Order fulfillment worked differently depending on which store you walked into. Shadowing staff across multiple locations turned up four distinct approaches, none formalized, each shaped by whatever a given store had improvised over time.'
				}
			]
		},
		{
			_type: 'layoutBlock',
			_key: 'c-floor',
			ratio: '2/1',
			items: [
				{
					_key: 'c-floor-a',
					kind: 'image',
					image: curb('1.2.png', 'Store aisle, a picker with totes, and a board of fulfillment research'),
					title: 'On the floor',
					text: 'Four improvised ways to pick, none of them written down.'
				},
				{
					_key: 'c-breaks-a',
					kind: 'image',
					image: curb('2.2.png', 'Six problems: manual entry, no standard training, rigid operations, no exception handling, connectivity breakdown, lacking oversight'),
					title: 'What the stores shared',
					text: 'Manual entry, no shared training, and no path for an exception.'
				}
			]
		},
		{
			_type: 'layoutBlock',
			_key: 'c-zones',
			ratio: '1/2',
			items: [
				{
					_key: 'c-zones-copy',
					kind: 'copy',
					paragraphs: [
						'Working with stakeholders, we refined those into one approach, grouping orders by temperature zone instead of by order or aisle. Ambient, chilled, frozen, and hot items each became their own wave, cutting the walking and backtracking that came with picking an order top to bottom.'
					]
				},
				{
					_key: 'c-board',
					kind: 'image',
					image: curb('2.1.png', 'Research board comparing how different stores defined temperature zones and pick flows'),
					title: 'One model',
					text: 'Temperature zones, defined the same way across stores.'
				}
			]
		},
		{
			_type: 'block',
			_key: 'c-stages',
			style: 'normal',
			markDefs: [],
			children: [
				{
					_type: 'span',
					_key: 'c-stages-s',
					marks: [],
					text: 'The fulfillment cycle breaks into four stages. Orders arrive and queue into pick lists first, a stage called Unreleased. Picking guides item collection by temperature zone. Staging bags and organizes by the same temperature groups. Handoff confirms the order at curbside once the customer arrives.'
				}
			]
		},
		{
			_type: 'fullImage',
			_key: 'c-cycle',
			image: curb('3.png', 'Diagram of queuing, picking, staging, and handoff, with the employee need and feature at each step')
		},
		{
			_type: 'block',
			_key: 'c-app',
			style: 'normal',
			markDefs: [],
			children: [
				{
					_type: 'span',
					_key: 'c-app-s',
					marks: [],
					text: 'The mobile app follows this model exactly, one guided workflow per stage.'
				}
			]
		},
		{
			_type: 'layoutBlock',
			_key: 'c-product',
			ratio: '1/2',
			items: [
				{
					_key: 'c-product-start',
					kind: 'image',
					image: curb('4.2.png', 'Two Zebra handhelds: a pick ready to start, and a Topo Chico with a substitution note'),
					label: 'Pick',
					title: 'One wave at a time',
					text: 'Stage time, the order, then the item in front of you.'
				},
				{
					_key: 'c-product-scan',
					kind: 'image',
					image: curb('5.2.png', 'Three Zebra handhelds: an item to scan, a successful scan, and a manual UPC entry'),
					label: 'Scan',
					title: 'Confirm, or type it',
					text: 'A good scan, then the UPC keyed in when the barcode will not read.'
				},
				{
					_key: 'c-product-copy',
					kind: 'copy',
					span: true,
					paragraphs: [
						'Visual cues, substitution handling, and exception flows catch errors before they reach a customer. The system stays flexible enough that an associate can hand a fulfillment off mid-stream without breaking the flow.'
					]
				}
			]
		},
		{
			_type: 'block',
			_key: 'c-edges',
			style: 'normal',
			markDefs: [],
			children: [
				{
					_type: 'span',
					_key: 'c-edges-s',
					marks: [],
					text: 'Once the core system was live, I led a set of smaller projects addressing the edge cases that kept surfacing in real stores. Prepicking let staff stage high-volume staples ahead of a fulfillment window instead of waiting for an order to trigger the pick, and SNAP substitutions kept the workflow compliant with benefit rules while still giving customers a real choice of replacement items. Flash Orders handled last-minute requests without disrupting whatever was already active on the floor. Customer Identification at Handoff added an age check for restricted items, requiring proof that the person accepting the order was 18 or older.'
				}
			]
		},
		{
			_type: 'fullImage',
			_key: 'c-system',
			image: curb('6.png', 'Collage of Zebra screens: start pick, flash orders, scan success, can\'t find item, tote scan, and customer handoff')
		},
		{
			_type: 'block',
			_key: 'c-h-device',
			style: 'h2',
			markDefs: [],
			children: [{ _type: 'span', _key: 'c-h-device-s', marks: [], text: 'Built Around the TC77' }]
		},
		{
			_type: 'layoutBlock',
			_key: 'c-device',
			ratio: '2/1',
			items: [
				{
					_key: 'c-device-copy',
					kind: 'copy',
					paragraphs: [
						'Staff carry a Zebra TC77, a rugged Android handheld built for retail, through every phase of fulfillment, scanning PLU codes while picking, confirming handoffs at curbside. The device\'s limited processing power and inconsistent store connectivity shaped much of the app\'s architecture. Data caches offline by default, so a task keeps moving even in a low-signal stockroom instead of stalling until a connection comes back.'
					]
				},
				{
					_key: 'c-device-a',
					kind: 'image',
					image: curb('5.1.png', 'Zebra handheld in a produce aisle, asking for a PLU scan of small mangoes'),
					title: 'On the device',
					text: 'PLU in the aisle, handoff at the curb.'
				}
			]
		},
		{
			_type: 'block',
			_key: 'c-h-impact',
			style: 'h2',
			markDefs: [],
			children: [{ _type: 'span', _key: 'c-h-impact-s', marks: [], text: 'Immediate Feedback, Lasting Impact' }]
		},
		{
			_type: 'block',
			_key: 'c-metrics',
			style: 'normal',
			markDefs: [],
			children: [
				{
					_type: 'span',
					_key: 'c-metrics-s',
					marks: [],
					text: 'Rollouts across stores over the following two years showed real movement. Fulfillment got 20% faster, training time fell by about 40%, and both accuracy and customer satisfaction improved.'
				}
			]
		},
		{
			_type: 'block',
			_key: 'c-pace',
			style: 'normal',
			markDefs: [],
			children: [
				{
					_type: 'span',
					_key: 'c-pace-s',
					marks: [],
					text: 'This is one of the most rewarding projects I\'ve worked on, mostly because of the pace. Decisions and iterations moved fast enough that there was rarely a dull stretch. But what mattered more was proximity. Most software work puts real distance between a decision and the feedback on it. Here, I could walk into a store, watch the app get used, and come back with something concrete to fix.'
				}
			]
		},
		{
			_type: 'quoteBlock',
			_key: 'c-quote',
			text: 'That access is most of why the tool ended up shaped around what stores actually needed instead of what we assumed they needed.'
		}
	]
}

const talent: Project = {
	_id: 'proj-talent',
	title: 'Talent Marketplace',
	slug: 'talent',
	description: 'A status for every timesheet, and a profile that updates itself.',
	tags: ['Product', 'Systems'],
	type: 'case-study',
	scope: '6 weeks (2023)',
	year: 2021,
	weight: 4,
	hidden: false,
	colorScheme: 'dark',
	colorAccent: '#f05a52',
	colorLight: '#ffffff',
	colorDark: '#141414',
	colorDarkest: '#d12a28',
	pageColor: '#8a1518',
	colorStops: [
		{ at: 't-status-card', color: '#ffffff', when: 'reveal' },
		{ at: 't-quote', color: '#8a1518', when: 'enter', line: 0.8 }
	],
	poster: poster(talentCover, 'Phone showing commute distance for a talent app'),
	previewVideo: null,
	brief: {
		paragraphs: [
			"'Talent' is a study on putting hiring in your pocket: browse, shortlist, and reach people without a desktop workflow."
		],
		facts: [
			{ label: 'Project type', items: ['Svelte Web Application'] },
			{ label: 'Resources', items: ['1 Designer', '1 UX Researcher'] },
			{
				label: 'Stakeholders',
				items: ['Director of UX', 'Director of Research', 'VP of Product']
			},
			{ label: 'Timeline', items: ['2021'] }
		]
	},
	seoDescription:
		'A case study on time-report status and a self-updating profile for Robert Half temporary workers.',
	externalUrl:
		'https://app.notion.com/p/anthonyi/Talent-in-Your-Pocket-25c037de312980b4815ef54e253f85dd?v=257037de312980cdac76000ce32240a1&source=copy_link',
	body: [
		{
			_type: 'layoutBlock',
			_key: 't-open',
			ratio: '2/1',
			items: [
				{
					_key: 't-open-copy',
					kind: 'copy',
					lead: true,
					paragraphs: [
						'Robert Half\'s temporary workers use a mobile app to submit time reports and manage their work profiles, but the app told them less than they needed to know.'
					]
				},
				{
					_key: 't-open-a',
					kind: 'image',
					image: tal('photo.png', 'A person holding a phone open to a Robert Half job listing, with a laptop behind it'),
					label: '01',
					title: 'In hand',
					text: 'Time reports and a profile, and not much said about either.'
				},
				{
					_key: 't-open-rest',
					kind: 'copy',
					span: true,
					paragraphs: [
						'A rejected timesheet came back with no explanation, and a profile could sit untouched for years without anyone noticing. This case study covers two features designed to fix that, a status system for time reports and a profile that updates itself instead of sitting as a static form.',
						'I joined post-MVP, brought in through Bottle Rocket as the systems and UI designer on a two-person team. The product strategy and the problems were already set. What came next was the execution: a component library, full interaction specs, and a visual language flexible enough to scale past these two features.'
					]
				}
			]
		},
		{
			_type: 'block',
			_key: 't-h-status',
			style: 'h2',
			markDefs: [],
			children: [{ _type: 'span', _key: 't-h-status-s', marks: [], text: 'Group Status for Time Reports' }]
		},
		{
			_type: 'block',
			_key: 't-status-problem',
			style: 'normal',
			markDefs: [],
			children: [
				{
					_type: 'span',
					_key: 't-status-problem-s',
					marks: [],
					text: 'A single mistake rejected an entire timesheet. Status showed as "Returned" or "Pending," nothing more, leaving workers to check hours worked, sick time, and overtime one by one until they found what went wrong.'
				}
			]
		},
		{
			_type: 'layoutBlock',
			_key: 't-status-card',
			ratio: '1fr',
			items: [
				{
					_key: 't-status-home',
					kind: 'image',
					image: tal(
						'status-1.png',
						'Three phones: a home card with returned hours, a tap that opens the time report, and a long-press menu'
					),
					title: 'On the card',
					text: 'Returned hours on the home screen. Tap for the report, or press for the menu.'
				}
			]
		},
		{
			_type: 'layoutBlock',
			_key: 't-status',
			ratio: '1fr',
			items: [
				{
					_key: 't-status-returned',
					kind: 'image',
					image: tal(
						'status-2.png',
						'Four phones walking from a returned timesheet through day entry to a resubmit drawer'
					),
					title: 'Returned',
					text: 'The days that failed, then the drawer to resubmit.'
				},
				{
					_key: 't-status-waiting',
					kind: 'image',
					image: tal(
						'status-3.png',
						'Two phones showing a timesheet awaiting approval and a drawer that can recall the draft'
					),
					title: 'Awaiting approval',
					text: 'When nothing is returned, the drawer only offers a recall.'
				},
				{
					_key: 't-status-copy',
					kind: 'copy',
					span: true,
					paragraphs: [
						'Status is color-coded and specific to each category. Worked hours can sit awaiting approval while sick time shows as already returned, both visible on the same home screen card. Every category stays on view, not just the ones needing action, so what\'s stuck is obvious at a glance.',
						'Returned reads in a specific red. Awaiting approval, orange. Approved, green. Each color holds up against accessibility contrast requirements and stays distinct even stacked several deep on one card.',
						'Long-press reveals quick actions, a tap opens the breakdown, a swipe dismisses it. Spacing, transition timing, and touch targets live in the component library, ready for the dev team to reuse without rebuilding.'
					]
				}
			]
		},
		{
			_type: 'block',
			_key: 't-h-profile',
			style: 'h2',
			markDefs: [],
			children: [{ _type: 'span', _key: 't-h-profile-s', marks: [], text: 'From Form to Dashboard' }]
		},
		{
			_type: 'block',
			_key: 't-profile-problem',
			style: 'normal',
			markDefs: [],
			children: [
				{
					_type: 'span',
					_key: 't-profile-problem-s',
					marks: [],
					text: 'Skills, experience, and education sat on the page, static, disconnected from one another, making it harder for Robert Half to match workers to the right jobs.'
				}
			]
		},
		{
			_type: 'layoutBlock',
			_key: 't-profile',
			ratio: '1fr',
			items: [
				{
					_key: 't-profile-home',
					kind: 'image',
					image: tal(
						'profile-1.png',
						'Two phones: a filled profile dashboard and the same screen with empty preference and education cards'
					),
					title: 'The profile',
					text: 'Preferences, experience, and skills, filled or waiting.'
				},
				{
					_key: 't-profile-pay',
					kind: 'image',
					image: tal(
						'profile-3.png',
						'Four phones: the profile, availability, a pay-rate slider against the market, and commute distance'
					),
					title: 'The rate',
					text: 'Where the slider starts, and how it compares while you drag.'
				},
				{
					_key: 't-profile-copy',
					kind: 'copy',
					span: true,
					paragraphs: [
						'The profile reads as a dashboard. Skills, work experience, education, and language proficiency all surface at the top level instead of hiding behind taps. Skills untouched for six months surface suggestions tied to job title. A new position prompts a tag for the skills that come with it. Suggestions launch generic, waiting on the backend to separate software skills from soft skills and language proficiency from everything else, sharpening as that intelligence arrives.',
						'Every card, Preferences, Skills, Work Experience, shares the same layout grid, type scale, and icon treatment, drawn from one component library. A language proficiency card added months later slotted in without a redesign.',
						'The Preferences card carries a pay rate slider showing market average in real time, spec\'d down to the tick marks. Where the slider starts. How the comparison label updates while dragging. What happens when a number lands above or below market rate.'
					]
				}
			]
		},
		{
			_type: 'block',
			_key: 't-h-curate',
			style: 'h2',
			markDefs: [],
			children: [{ _type: 'span', _key: 't-h-curate-s', marks: [], text: 'Resume Curation' }]
		},
		{
			_type: 'block',
			_key: 't-curate-intro',
			style: 'normal',
			markDefs: [],
			children: [
				{
					_type: 'span',
					_key: 't-curate-intro-s',
					marks: [],
					text: 'Curate interactions surface prompts the moment the app detects a gap or outdated information, woven into the onboarding flow rather than dropped in as separate pop-ups.'
				}
			]
		},
		{
			_type: 'layoutBlock',
			_key: 't-curate',
			ratio: '1fr',
			items: [
				{
					_key: 't-curate-banner',
					kind: 'image',
					image: tal(
						'banner.png',
						'Three phones: a profile, a dismissible banner asking about on-site work, and location preferences updated after yes'
					),
					title: 'On-site',
					text: 'Three on-site jobs, then a banner you can dismiss.'
				},
				{
					_key: 't-curate-apply',
					kind: 'image',
					image: tal(
						'curate-1.png',
						'Four phones: choosing a resume, the application, required skills, and a work-status question'
					),
					title: 'While applying',
					text: 'The skills the job needs, before the application stalls.'
				},
				{
					_key: 't-curate-gap',
					kind: 'image',
					image: tal(
						'curate-3.png',
						'Four phones: salary and hourly pay, commute distance, and a create-account step that asks about visa status'
					),
					title: 'The gap',
					text: 'Pay, commute, and the visa question, asked before it blocks a job.'
				},
				{
					_key: 't-curate-copy',
					kind: 'copy',
					span: true,
					paragraphs: [
						'Browse three on-site jobs in a row, and a dismissible banner asks whether to update preferences for on-site work. Apply somewhere that requires visa status with the field left blank, and a task card surfaces before the application can stall on it. That one opens into a modal rather than a toggle, explaining why the question is being asked before a worker has to answer it.'
					]
				}
			]
		},
		{
			_type: 'block',
			_key: 't-h-changed',
			style: 'h2',
			markDefs: [],
			children: [{ _type: 'span', _key: 't-h-changed-s', marks: [], text: 'What Changed' }]
		},
		{
			_type: 'block',
			_key: 't-changed',
			style: 'normal',
			markDefs: [],
			children: [
				{
					_type: 'span',
					_key: 't-changed-s',
					marks: [],
					text: 'Time report status went from one word with no detail to color-coded and specific to the category. The profile went from a static form workers rarely touched to an active dashboard with contextual prompts. Preferences moved from buried in settings to visible, editable, and tied to recommendations. Missing information stopped hiding until it blocked a job, showing up instead as a task card before it became a blocker.'
				}
			]
		},
		{
			_type: 'block',
			_key: 't-metrics',
			style: 'normal',
			markDefs: [],
			children: [
				{
					_type: 'span',
					_key: 't-metrics-s',
					marks: [],
					text: 'Robert Half\'s internal metrics showed it landing. Fewer resubmissions, faster profile completion, better job-match rates. But the simplest signal was the support tickets asking "Why was my time rejected?" Those tickets dropped, because the app answered that question itself.'
				}
			]
		},
		{
			_type: 'block',
			_key: 't-guessing',
			style: 'normal',
			markDefs: [],
			children: [
				{
					_type: 'span',
					_key: 't-guessing-s',
					marks: [],
					text: 'Workers weren\'t asking for dashboards or color-coded cards. They wanted to stop guessing.'
				}
			]
		},
		{
			_type: 'quoteBlock',
			_key: 't-quote',
			text: 'We added specificity, not features.'
		},
		{
			_type: 'block',
			_key: 't-h-reflect',
			style: 'h2',
			markDefs: [],
			children: [{ _type: 'span', _key: 't-h-reflect-s', marks: [], text: 'Reflection' }]
		},
		{
			_type: 'block',
			_key: 't-reflect-1',
			style: 'normal',
			markDefs: [],
			children: [
				{
					_type: 'span',
					_key: 't-reflect-1s',
					marks: [],
					text: 'Coming into this after the MVP meant inheriting decisions that weren\'t mine to make. Some were good. Some were locked in for reasons that will stay a mystery. It meant spending most of the time on craft instead of defending a vision, since the product team already knew what workers needed. What was left was turning that into a UI that didn\'t leave anyone guessing, workers or the dev team.'
				}
			]
		},
		{
			_type: 'block',
			_key: 't-reflect-2',
			style: 'normal',
			markDefs: [],
			children: [
				{
					_type: 'span',
					_key: 't-reflect-2s',
					marks: [],
					text: 'None of this needed new data. Time reports had statuses. Profiles had data. Preferences existed. None of it was visible or consistent enough to do anything for anyone. Making that visible was most of the actual work.'
				}
			]
		},
		{
			_type: 'block',
			_key: 't-reflect-3',
			style: 'normal',
			markDefs: [],
			children: [
				{
					_type: 'span',
					_key: 't-reflect-3s',
					marks: [],
					text: 'Robert Half\'s workers aren\'t one-time users. They come back for the next assignment, and the next, building a history the app now actually keeps.'
				}
			]
		}
	]
}

const insurance: Project = {
	_id: 'proj-insurance',
	title: 'Insurance Aggregator',
	slug: 'insurance',
	description: 'Dense tools for agents. A short path for the people buying a policy.',
	tags: ['Product', 'Research', 'Systems'],
	type: 'case-study',
	scope: '8 weeks (2022)',
	year: 2024,
	weight: 3,
	hidden: false,
	colorScheme: 'dark',
	colorAccent: '#2bcf78',
	colorLight: '#ffffff',
	colorDark: '#141414',
	colorDarkest: '#0D3E23',
	pageColor: '#0D3E23',
	colorStops: [
		{ at: 'g-context', color: '#ededed', when: 'reveal' },
		{ at: 'g-quote', color: '#0D3E23', when: 'enter', line: 0.8 }
	],
	poster: poster(aviator, 'Insurance quote comparison dashboard'),
	previewVideo: null,
	brief: {
		paragraphs: [
			"'Aviator' is a study on demystifying a coverage marketplace so people can compare, choose, and buy without the jargon."
		],
		facts: [
			{ label: 'Project type', items: ['Svelte Web Application'] },
			{ label: 'Resources', items: ['1 Designer', '1 UX Researcher'] },
			{
				label: 'Stakeholders',
				items: ['Director of UX', 'Director of Research', 'VP of Product']
			},
			{ label: 'Timeline', items: ['2024'] }
		]
	},
	seoDescription:
		'A case study on splitting a brittle insurance CRM into an agent workflow and a short client path to purchase.',
	externalUrl:
		'https://app.notion.com/p/anthonyi/Demystifying-coverage-marketplace-257037de31298000bd68fa954cb48ec1?v=257037de312980cdac76000ce32240a1&source=copy_link',
	body: [
		{
			_type: 'layoutBlock',
			_key: 'g-open',
			ratio: '1fr',
			items: [
				{
					_key: 'g-open-copy',
					kind: 'copy',
					lead: true,
					paragraphs: [
						'Joining a lean design unit inside an insurance enterprise meant untangling a core tension: agents needed dense, information-heavy tools to manage policies, while clients needed the opposite, a fast and minimal path to purchase.'
					]
				},
				{
					_key: 'g-open-a',
					kind: 'image',
					image: insure(
						'03.png',
						'Audit of the old Salesforce dashboard beside a working session reviewing the quote forms'
					),
					label: '01',
					title: 'The brittle file',
					text: 'The same client, re-entered in every tool.'
				},
				{
					_key: 'g-open-crm',
					kind: 'copy',
					span: true,
					paragraphs: [
						'Underneath both sat a Salesforce CRM that had gone brittle under its own growth, where agents re-entered the same client information every time a new tool got bolted on, policy updates lived in email threads instead of a system meant to track them, and clients ended up with inconsistent documents depending on who last touched their file.'
					]
				}
			]
		},
		{
			_type: 'layoutBlock',
			_key: 'g-context',
			ratio: '1fr',
			items: [
				{
					_key: 'g-context-copy',
					kind: 'copy',
					paragraphs: [
						'Growth had slowed under the weight of it, more of an operations problem than a demand one. Fixing it meant splitting the build into two distinct experiences instead of stretching one interface to cover both audiences. The design unit anchored every decision against three measures, agent efficiency, client conversion, and technical scalability, testing each proposed feature against whether it actually moved one of those or just added complexity. That discipline kept scope tied to real friction points, not internal opinion about what the product should look like.'
					]
				},
				{
					_key: 'g-context-a',
					kind: 'image',
					image: insure(
						'01.png',
						'Three panels labeled lead generation, application submissions, and partner integrations'
					),
					label: '02',
					title: 'Split the work',
					text: 'Leads, applications, and the partners behind both.'
				}
			]
		},
		{
			_type: 'block',
			_key: 'g-h-agent',
			style: 'h2',
			markDefs: [],
			children: [{ _type: 'span', _key: 'g-h-agent-s', marks: [], text: 'Agent Workflows' }]
		},
		{
			_type: 'block',
			_key: 'g-agent-time',
			style: 'normal',
			markDefs: [],
			children: [
				{
					_type: 'span',
					_key: 'g-agent-time-s',
					marks: [],
					text: 'Agent workflows were where I spent most of my time on this project, streamlining the process and making the path to purchase more intuitive.'
				}
			]
		},
		{
			_type: 'block',
			_key: 'g-agent-discovery',
			style: 'normal',
			markDefs: [],
			children: [
				{
					_type: 'span',
					_key: 'g-agent-discovery-s',
					marks: [],
					text: 'Early discovery sessions found agents spending roughly 30% of their time reconciling mismatched customer information between sticky notes, OneNote, and whatever Salesforce had on file. Auditing their working processes exposed where entries went missing or got duplicated, and that gap became the starting point for redesigning how agents worked, and eventually how clients onboarded too.'
				}
			]
		},
		{
			_type: 'fullImage',
			_key: 'g-research',
			image: insure(
				'02.png',
				'Research spread covering competitive analysis, a customer journey, sticky-note findings, and a FigJam audit of the response page'
			)
		},
		{
			_type: 'layoutBlock',
			_key: 'g-agent',
			ratio: '1/2',
			items: [
				{
					_key: 'g-agent-flow',
					kind: 'image',
					image: insure(
						'05.png',
						'Prototype flow connecting driver, phone, and response screens in one form'
					),
					title: 'One form',
					text: 'Jump sections without losing the conversation.'
				},
				{
					_key: 'g-agent-quote',
					kind: 'image',
					image: insure(
						'07.png',
						'Agent quote table with a carrier filter open on the results step'
					),
					title: 'The quote',
					text: 'Filter to the carriers that matter.'
				},
				{
					_key: 'g-agent-copy',
					kind: 'copy',
					span: true,
					paragraphs: [
						'Working with the product manager, that audit extended into the interface itself, touch points, trade-offs, and friction, page by page. The old dashboard ran agents through five separate, linear forms. It\'s one dynamic form now, and agents can jump between sections without losing anything they\'ve already entered. That lets them run a sales conversation in whatever order feels natural instead of forcing a client through a fixed sequence of questions. Clickable prototypes went in front of agent focus groups early, and where an interaction cue failed or slowed someone down, the workflow got refined before any of it reached development.'
					]
				}
			]
		},
		{
			_type: 'layoutBlock',
			_key: 'g-desk',
			ratio: '1fr',
			items: [
				{
					_key: 'g-desk-a',
					kind: 'image',
					image: insure(
						'08.png',
						'Agent desktop comparing home, auto, and flood quotes beside a market-share chart'
					),
					title: 'The desk',
					text: 'Quotes beside the market, not in a separate tool.'
				}
			]
		},
		{
			_type: 'block',
			_key: 'g-h-scale',
			style: 'h2',
			markDefs: [],
			children: [{ _type: 'span', _key: 'g-h-scale-s', marks: [], text: 'Built to Scale' }]
		},
		{
			_type: 'layoutBlock',
			_key: 'g-scale',
			ratio: '1/2',
			items: [
				{
					_key: 'g-scale-library',
					kind: 'image',
					image: insure(
						'03-1.png',
						'Selection tiles in Figma next to the same policy card in Storybook'
					),
					title: 'The library',
					text: 'Designed in Figma, shipped in Storybook.'
				},
				{
					_key: 'g-scale-brand',
					kind: 'image',
					image: insure(
						'04.png',
						'A white-label quote tool with a swappable logo, bot name, and domain, beside partner marks'
					),
					title: 'Per partner',
					text: 'Logo, color, and domain from one config.'
				},
				{
					_key: 'g-scale-copy',
					kind: 'copy',
					span: true,
					paragraphs: [
						'A component library, built first in Figma and then translated into Storybook, means core UI elements like form fields and tables can be reused across both agent and client workflows without pulling the design unit back in for every new one.',
						'White-labeling drove the choice of Tailwind as the front-end framework. Root configuration lets colors and branding update per business partner without touching the underlying components, which matters for a system built to support B2B growth beyond this one brokerage.',
						'Clickable prototypes were tested with agent focus groups. We observed where interaction cues failed or slowed them down, then refined during early development. This cyclical approach kept our work grounded in the real day-to-day needs.'
					]
				}
			]
		},
		{
			_type: 'block',
			_key: 'g-h-client',
			style: 'h2',
			markDefs: [],
			children: [{ _type: 'span', _key: 'g-h-client-s', marks: [], text: 'Client Experience' }]
		},
		{
			_type: 'layoutBlock',
			_key: 'g-client',
			ratio: '1fr',
			items: [
				{
					_key: 'g-client-copy',
					kind: 'copy',
					paragraphs: [
						'Clients ran into a different problem than agents did. The site presented long, jargon-heavy forms with only four policy options to choose from, and abandonment spiked partway through a quote because people didn\'t understand what was being asked of them, or why. Calling an agent directly was often easier, since an agent would handle the recording and could offer more coverage options than the website supported in the first place.',
						'The client experience is a fast, stripped-down path through the form now, instead of a long questionnaire full of insurance jargon.'
					]
				},
				{
					_key: 'g-client-a',
					kind: 'image',
					image: insure(
						'09.png',
						'Three phones showing a client quote: a short intro, home details, and coverage choices'
					),
					title: 'The short path',
					text: 'Home details, then coverage. No jargon.'
				}
			]
		},
		{
			_type: 'block',
			_key: 'g-h-small',
			style: 'h2',
			markDefs: [],
			children: [{ _type: 'span', _key: 'g-h-small-s', marks: [], text: 'Smaller Features' }]
		},
		{
			_type: 'block',
			_key: 'g-small',
			style: 'normal',
			markDefs: [],
			children: [
				{
					_type: 'span',
					_key: 'g-small-s',
					marks: [],
					text: 'A notification system and a partner-facing API portal rounded out the build, both meant to keep other departments running on the same system rather than falling back on separate tools.'
				}
			]
		},
		{
			_type: 'block',
			_key: 'g-h-results',
			style: 'h2',
			markDefs: [],
			children: [{ _type: 'span', _key: 'g-h-results-s', marks: [], text: 'Results' }]
		},
		{
			_type: 'block',
			_key: 'g-results',
			style: 'normal',
			markDefs: [],
			children: [
				{
					_type: 'span',
					_key: 'g-results-s',
					marks: [],
					text: 'Agent task completion improved by about 15% over time, and quoting and lead-management errors dropped enough that Quality Control noticed. On the client side, click-through analytics rose 10%, alongside smoother navigation and better reported satisfaction.'
				}
			]
		},
		{
			_type: 'block',
			_key: 'g-h-reflect',
			style: 'h2',
			markDefs: [],
			children: [{ _type: 'span', _key: 'g-h-reflect-s', marks: [], text: 'Reflection' }]
		},
		{
			_type: 'block',
			_key: 'g-reflect',
			style: 'normal',
			markDefs: [],
			children: [
				{
					_type: 'span',
					_key: 'g-reflect-s',
					marks: [],
					text: 'What stuck with me most was how much the agent and client sides depended on each other even though they were never on the same screen.'
				}
			]
		},
		{
			_type: 'quoteBlock',
			_key: 'g-quote',
			text: 'A form field simplified for one side could quietly break something an agent relied on for a sales conversation.'
		},
		{
			_type: 'block',
			_key: 'g-close',
			style: 'normal',
			markDefs: [],
			children: [
				{
					_type: 'span',
					_key: 'g-close-s',
					marks: [],
					text: 'Nothing got shipped without checking it against both. That kind of project only holds together if the product team stays in the same room, or close to it, the whole way through.'
				}
			]
		}
	]
}

const convenience: Project = {
	_id: 'proj-convenience',
	title: 'Conversational Convenience',
	slug: 'convenience',
	description: 'How far conversational commerce should go when the visit is short.',
	tags: ['Product', 'Research', 'Prototyping'],
	type: 'case-study',
	scope: 'Fall 2025',
	year: 2025,
	weight: 1,
	hidden: false,
	colorScheme: 'dark',
	colorAccent: '#3a3a3a',
	colorLight: '#ffffff',
	colorDark: '#141414',
	colorDarkest: '#000000',
	pageColor: '#872C02',
	colorStops: [
		{ at: 'f-question', color: '#000000', when: 'reveal' },
		{ at: 'f-aisle', color: '#ededed', when: 'center', line: 0.3 },
		{ at: 'f-quote', color: '#872C02', when: 'enter', line: 0.8 }
	],
	poster: poster(convConv, '7-Eleven app with a late-night craving prompt'),
	previewVideo: null,
	brief: {
		paragraphs: [
			'Search works well for people who know exactly what they want.',
			'This study asks what happens when convenience retail still needs room to browse.'
		],
		facts: [
			{ label: 'Project type', items: ['iOS App'] },
			{ label: 'Resources', items: ['1 Designer', '1 UX Researcher'] },
			{
				label: 'Stakeholders',
				items: ['Director of UX', 'Director of Research', 'VP of Product']
			},
			{ label: 'Timeline', items: ['Fall 2025'] }
		]
	},
	seoDescription:
		'A case study on search that reorganizes a convenience catalogue instead of shopping for the customer.',
	body: [
		{
			_type: 'layoutBlock',
			_key: 'f-open',
			ratio: '2/1',
			items: [
				{
					_key: 'f-open-copy',
					kind: 'copy',
					lead: true,
					paragraphs: [
						'In 2025, leading AI labs began building commerce partnerships with retailers like Walmart and Target. Instantly, the question for us was hard to ignore: what should convenience retailers do with the same wave?'
					]
				},
				{
					_key: 'f-open-a',
					kind: 'image',
					image: conv('1.1.png', 'OpenAI announcement for buying in ChatGPT through the Agentic Commerce Protocol'),
					label: '01',
					title: 'The wave',
					text: 'Agentic checkout, aimed at a longer kind of shopping.'
				}
			]
		},
		{
			_type: 'block',
			_key: 'f-question',
			style: 'normal',
			markDefs: [],
			children: [
				{
					_type: 'span',
					_key: 'f-question-s',
					marks: [],
					text: 'The problem space sits there: how far should conversational commerce go when the visit is brief, the intent is unfinished, and the customer still wants to stay in control?'
				}
			]
		},
		{
			_type: 'block',
			_key: 'f-job',
			style: 'normal',
			markDefs: [],
			children: [
				{
					_type: 'span',
					_key: 'f-job-s',
					marks: [],
					text: 'Convenience is a different job. People want to be in and out. Baskets are small, time is short, and many shoppers are still deciding what they want while they look. An agent that shops on your behalf, or a chat that collapses the store into a few picks, may fit a different kind of retail than this one.'
				}
			]
		},
		{
			_type: 'layoutBlock',
			_key: 'f-visit',
			ratio: '1fr',
			items: [
				{
					_key: 'f-open-b',
					kind: 'image',
					image: conv('1.2.png', '7-Eleven storefront at dusk with a question mark in the sky'),
					label: '02',
					title: 'The visit',
					text: 'In and out, basket still unfinished.'
				}
			]
		},
		{
			_type: 'block',
			_key: 'f-board-1',
			style: 'normal',
			markDefs: [],
			children: [
				{
					_type: 'span',
					_key: 'f-board-1s',
					marks: [],
					text: 'My research partner and I started on a whiteboard. Before sketching search flows, we needed a clear picture of how people already use AI when they shop, and how far that habit reaches into convenience retail.'
				}
			]
		},
		{
			_type: 'block',
			_key: 'f-board-2',
			style: 'normal',
			markDefs: [],
			children: [
				{
					_type: 'span',
					_key: 'f-board-2s',
					marks: [],
					text: 'What we kept seeing: AI shows up for large purchases. Someone will research a car, compare appliances, or plan a trip with a chatbot. That is a long decision with room for back-and-forth. A 7-Eleven run is not. People are often hungry, in a hurry, and still figuring out what they want while they look.'
				}
			]
		},
		{
			_type: 'block',
			_key: 'f-board-3',
			style: 'normal',
			markDefs: [],
			children: [
				{
					_type: 'span',
					_key: 'f-board-3s',
					marks: [],
					text: 'We brought in the Unified Theory of Acceptance and Use of Technology as a simple checklist. Would this feel useful? Would it feel easy? Would anyone around them make it normal? Would the store’s systems even support it? Those questions kept us from treating agentic search as automatic progress.'
				}
			]
		},
		{
			_type: 'block',
			_key: 'f-board-4',
			style: 'normal',
			markDefs: [],
			children: [
				{
					_type: 'span',
					_key: 'f-board-4s',
					marks: [],
					text: 'The board’s conclusion was plain. Patterns built for big-ticket shopping shrink a convenience store instead of opening it. Next we looked at the ones that fail on that point.'
				}
			]
		},
		{
			_type: 'fullImage',
			_key: 'f-whiteboard',
			image: conv('2.png', 'Research board on how people shop with AI and what that means for a convenience store')
		},
		{
			_type: 'layoutBlock',
			_key: 'f-fails',
			ratio: '3/3',
			items: [
				{
					_key: 'f-fail-1',
					kind: 'image',
					stroke: true,
					image: conv('3.1.png', 'A craving for something sweet is turned into a confirmed ice cream order'),
					title: 'A line in the sand',
					text: 'People were clear about distrust. Even if the system knew their preferences cold, they did not want AI to take the wheel and shop for them. Automatic buying crossed a line. Search could suggest and rearrange. It should not decide.'
				},
				{
					_key: 'f-fail-2',
					kind: 'image',
					stroke: true,
					image: conv('3.2.png', 'A mid-day refuel request is answered by reserving a gas pump'),
					title: 'Double meanings',
					text: 'Short requests often carry more than one reading. “I need to refuel” can mean gas in the tank or caffeine in the cup. In convenience culture those sit side by side, and a search that commits too early has already misunderstood half of what the person might have meant.'
				},
				{
					_key: 'f-fail-3',
					kind: 'image',
					stroke: true,
					image: conv('3.3.png', 'A request for food for ten returns three products and a running total'),
					title: 'A pigeon-hole view',
					text: 'Agentic chat that offers a few strong picks hides the rest of the store. That can work when someone wants one specific product. It fails when they are still looking for ideas. Convenience shopping needs the catalogue in reach, not a narrow set of answers that pretend the decision is already over.'
				}
			]
		},
		{
			_type: 'block',
			_key: 'f-aisle-before',
			style: 'normal',
			markDefs: [],
			children: [
				{
					_type: 'span',
					_key: 'f-aisle-before-s',
					marks: [],
					text: 'A convenience run is the aisle. People come in hungry and already short on time, and they are still deciding while they look. The hot case, the cooler, the shelf at eye level. The visit is brief. The looking is how the choice gets made.'
				}
			]
		},
		{
			_type: 'videoBlock',
			_key: 'f-aisle',
			canScrub: false,
			seekOnScroll: false,
			file: { url: '/projects/convenience/store-visit.mp4' },
			poster: conv('4.png', 'A convenience aisle: snack shelves on the left, a cooler of drinks on the right'),
			width: 4096,
			height: 2648
		},
		{
			_type: 'block',
			_key: 'f-aisle-after',
			style: 'normal',
			markDefs: [],
			children: [
				{
					_type: 'span',
					_key: 'f-aisle-after-s',
					marks: [],
					text: 'That looking is what the interface has to keep. Search can shift where the eye lands. It should not take the aisle away and hand back a handful of picks.'
				}
			]
		},
		{
			_type: 'block',
			_key: 'f-h-search',
			style: 'h2',
			markDefs: [],
			children: [{ _type: 'span', _key: 'f-h-search-s', marks: [], text: 'Search reorganizes the store' }]
		},
		{
			_type: 'block',
			_key: 'f-search-1',
			style: 'normal',
			markDefs: [],
			children: [
				{
					_type: 'span',
					_key: 'f-search-1s',
					marks: [],
					text: 'Type protein-packed lunch and the catalogue rearranges around it instead of returning a separate list. Horizontal rows form above the store — each a plausible reading of the request, not a single guess.'
				}
			]
		},
		{
			_type: 'block',
			_key: 'f-search-2',
			style: 'normal',
			markDefs: [],
			children: [
				{
					_type: 'span',
					_key: 'f-search-2s',
					marks: [],
					text: 'Hot case, highest protein. Cold and ready to grab. Under three dollars. Each title explains the grouping, so a wrong read is obvious immediately.'
				}
			]
		},
		{
			_type: 'layoutBlock',
			_key: 'f-demos',
			ratio: '3/3',
			items: [
				{
					_key: 'f-demo-lunch',
					kind: 'video',
					video: conv('lunch.mp4', ''),
					poster: conv('lunch-poster.png', 'Protein-packed lunch grouped into a hot case row and a cold row'),
					label: 'Lunch',
					title: 'Highest protein',
					text: 'Hot case, then cold and ready to grab.'
				},
				{
					_key: 'f-demo-movie',
					kind: 'video',
					video: conv('movie-night.mp4', ''),
					poster: conv('movie-poster.png', 'Movie night search grouped into munchies and candy'),
					label: 'Movie night',
					title: 'Two readings',
					text: 'Munchies, then the candy aisle.'
				},
				{
					_key: 'f-demo-road',
					kind: 'video',
					video: conv('roadtrip.mp4', ''),
					poster: conv('road-poster.png', 'Road trip search grouped into snacks and drinks'),
					label: 'Road trip',
					title: 'For the drive',
					text: 'No-mess snacks, then something to sip.'
				},
				{
					_key: 'f-demo-copy',
					kind: 'copy',
					span: true,
					paragraphs: [
						'The regular catalogue stays below. Scroll past a bad guess and you’re back in the full store — nothing hidden, only reordered.',
						'Add no dairy and the rows reshape instead of reloading. Quick filters under search — hot only, under $5, no dairy, family size — let people test their way into a decision.',
						'Short or vague requests aren’t user error — they’re unfinished decisions. “Something for lunch” may need a visual feed, not a clarifying quiz.'
					]
				},
				{
					_key: 'f-ask-copy',
					kind: 'copy',
					span: true,
					heading: 'Few questions, only when they’d change something',
					paragraphs: [
						'Ask a follow-up only when the answer would change which rows show up. For the drive, or for the office? Yes. Want that chilled? No — just lead with chilled.',
						'A clear product name, a category, or hungry skips the question. When help is needed, ask once and fall back to the best guess if they skip.'
					]
				}
			]
		},
		{
			_type: 'block',
			_key: 'f-h-argue',
			style: 'h2',
			markDefs: [],
			children: [{ _type: 'span', _key: 'f-h-argue-s', marks: [], text: 'What the concept argues' }]
		},
		{
			_type: 'quoteBlock',
			_key: 'f-quote',
			text: 'Browsing is not wasted time that search should eliminate.'
		},
		{
			_type: 'block',
			_key: 'f-argue-1',
			style: 'normal',
			markDefs: [],
			children: [
				{
					_type: 'span',
					_key: 'f-argue-1s',
					marks: [],
					text: 'In convenience retail, browsing is often how someone decides what they want.'
				}
			]
		},
		{
			_type: 'block',
			_key: 'f-argue-2',
			style: 'normal',
			markDefs: [],
			children: [
				{
					_type: 'span',
					_key: 'f-argue-2s',
					marks: [],
					text: 'The opportunity is not to force a more exact prompt, or to make a model choose for them. It is to give people a more relevant place to begin looking.'
				}
			]
		},
		{
			_type: 'block',
			_key: 'f-argue-3',
			style: 'normal',
			markDefs: [],
			children: [
				{
					_type: 'span',
					_key: 'f-argue-3s',
					marks: [],
					text: 'Treat search as a way to reorganize a catalogue rather than replace it. Offer several reasonable interpretations, make assumptions visible, and leave the whole store within reach. The value is not a more conversational search bar, but a catalogue that can move with the customer’s thinking.'
				}
			]
		},
		{
			_type: 'layoutBlock',
			_key: 'f-limits',
			ratio: '1/2',
			items: [
				{
					_key: 'f-limits-copy',
					kind: 'copy',
					heading: 'The limits',
					paragraphs: [
						'An earlier version assumed the system could personalize with purchase history, time of day, and weather. Those signals may not be connected, current, or fast enough at the searching moment. Personalization can improve things later. It is not required for the core interaction.',
						'The catalogue is a constraint too. Hand-applied tags are brittle. They miss phrasing the tag set was not built for, and weak nutrition or vendor data limits how confidently a row can be labeled. Inventory can lag the shelf. None of that is fixed by the interface, and the concept should not imply that it is.',
						'So the rows present useful readings of a request, not definitive answers. Copy explains the grouping instead of claiming to know the person. Empty states do not invent completeness from weak matches.'
					]
				},
				{
					_key: 'f-crew',
					kind: 'video',
					video: { url: '/projects/convenience/con-conv-crew.mp4' },
					poster: conv('crew-poster.png', 'Search field reading breakfast for a crew')
				}
			]
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
	poster: null,
	previewVideo: null,
	body: []
}

convenience.nextProject = {
	_id: curbside._id,
	title: curbside.title,
	slug: curbside.slug,
	hidden: curbside.hidden,
	weight: curbside.weight,
	colorScheme: curbside.colorScheme,
	colorAccent: curbside.colorAccent,
	colorLight: curbside.colorLight,
	colorDark: curbside.colorDark,
	colorDarkest: curbside.colorDarkest,
	poster: curbside.poster
}

curbside.nextProject = {
	_id: insurance._id,
	title: insurance.title,
	slug: insurance.slug,
	hidden: insurance.hidden,
	weight: insurance.weight,
	colorScheme: insurance.colorScheme,
	colorAccent: insurance.colorAccent,
	colorLight: insurance.colorLight,
	colorDark: insurance.colorDark,
	colorDarkest: insurance.colorDarkest,
	poster: insurance.poster
}

insurance.nextProject = {
	_id: talent._id,
	title: talent.title,
	slug: talent.slug,
	hidden: talent.hidden,
	weight: talent.weight,
	colorScheme: talent.colorScheme,
	colorAccent: talent.colorAccent,
	colorLight: talent.colorLight,
	colorDark: talent.colorDark,
	colorDarkest: talent.colorDarkest,
	poster: talent.poster
}

talent.nextProject = {
	_id: convenience._id,
	title: convenience.title,
	slug: convenience.slug,
	hidden: convenience.hidden,
	weight: convenience.weight,
	colorScheme: convenience.colorScheme,
	colorAccent: convenience.colorAccent,
	colorLight: convenience.colorLight,
	colorDark: convenience.colorDark,
	colorDarkest: convenience.colorDarkest,
	poster: convenience.poster
}

export const projectsFixture: Project[] = [curbside, talent, insurance, convenience, hidden]
