import { defineArrayMember, defineField, defineType } from 'sanity'

/** Every block a case-study body can hold. Shared by the English and Spanish bodies. */
const bodyMembers = () => [
	defineArrayMember({
		type: 'block',
		styles: [
			{ title: 'Paragraph', value: 'normal' },
			{ title: 'Heading', value: 'h2' },
			{ title: 'Subheading', value: 'h3' }
		],
		lists: []
	}),
	defineArrayMember({ type: 'fullImage' }),
	defineArrayMember({ type: 'layoutBlock' }),
	defineArrayMember({ type: 'videoBlock' }),
	defineArrayMember({ type: 'team' }),
	defineArrayMember({ type: 'listBlock' }),
	defineArrayMember({ type: 'quoteBlock' }),
	defineArrayMember({ type: 'slideShow' }),
	defineArrayMember({ type: 'spacer' })
]

/** The facts column painted over the poster: a few paragraphs and labelled lists. */
const briefFields = () => [
	defineField({
		name: 'paragraphs',
		type: 'array',
		of: [defineArrayMember({ type: 'text', rows: 3 })]
	}),
	defineField({
		name: 'facts',
		type: 'array',
		of: [
			defineArrayMember({
				type: 'object',
				name: 'fact',
				fields: [
					defineField({ name: 'label', type: 'string', description: 'e.g. Timeline, Resources' }),
					defineField({
						name: 'items',
						type: 'array',
						of: [defineArrayMember({ type: 'string' })]
					})
				],
				preview: { select: { title: 'label', subtitle: 'items.0' } }
			})
		]
	})
]

export const project = defineType({
	name: 'project',
	title: 'Project',
	type: 'document',
	groups: [
		{ name: 'main', title: 'English', default: true },
		{ name: 'es', title: 'Español (Perú)' },
		{ name: 'look', title: 'Colour & motion' },
		{ name: 'seo', title: 'SEO' }
	],
	fields: [
		// ── English: the source of truth. Anything left empty in Spanish falls back to these.
		defineField({
			name: 'title',
			type: 'string',
			group: 'main',
			validation: (r) => r.required()
		}),
		defineField({
			name: 'slug',
			type: 'slug',
			group: 'main',
			description: 'Used in the URL, and the same in both languages.',
			options: { source: 'title' },
			validation: (r) => r.required()
		}),
		defineField({ name: 'description', type: 'string', group: 'main', title: 'Tagline' }),
		defineField({
			name: 'tags',
			type: 'array',
			group: 'main',
			of: [defineArrayMember({ type: 'string' })],
			options: { layout: 'tags' }
		}),
		defineField({
			name: 'type',
			type: 'string',
			group: 'main',
			options: {
				list: [
					{ title: 'Case study', value: 'case-study' },
					{ title: 'Gallery', value: 'gallery' },
					{ title: 'Blank', value: 'blank' }
				],
				layout: 'radio'
			},
			initialValue: 'case-study'
		}),
		defineField({ name: 'scope', type: 'string', group: 'main', description: 'e.g. 8 weeks (2024)' }),
		defineField({
			name: 'year',
			type: 'number',
			group: 'main',
			description: 'Shown on the home and work cards'
		}),
		defineField({
			name: 'weight',
			type: 'number',
			group: 'main',
			initialValue: 0,
			description: 'Sort order, lower first'
		}),
		defineField({
			name: 'hidden',
			type: 'boolean',
			group: 'main',
			initialValue: false,
			description: 'Unlisted: still reachable by link, kept out of lists and search engines.'
		}),
		defineField({
			name: 'poster',
			type: 'image',
			group: 'main',
			options: { hotspot: true },
			fields: [defineField({ name: 'alt', type: 'string', title: 'Alt text' })]
		}),
		defineField({
			name: 'previewVideo',
			type: 'file',
			group: 'main',
			options: { accept: 'video/*' },
			description: 'H.264 MP4, ≤10s, compressed before upload. Ambient card loop.'
		}),
		defineField({
			name: 'brief',
			type: 'object',
			group: 'main',
			description: 'The short column of facts shown over the poster.',
			fields: briefFields()
		}),
		defineField({
			name: 'body',
			type: 'array',
			group: 'main',
			of: bodyMembers()
		}),
		defineField({
			name: 'nextProject',
			type: 'reference',
			group: 'main',
			weak: true,
			to: [{ type: 'project' }],
			description: 'Optional. Defaults to the next case study in order.',
			validation: (Rule) =>
				Rule.custom((value, context) => {
					if (!value?._ref) return true
					const id = context.document?._id?.replace(/^drafts\./, '')
					if (value._ref === id) return 'A project cannot point to itself'
					return true
				})
		}),

		// ── Español (Perú): optional overrides. Write them in your own voice, not word for word.
		defineField({ name: 'descriptionEs', type: 'string', group: 'es', title: 'Tagline (ES)' }),
		defineField({ name: 'scopeEs', type: 'string', group: 'es', title: 'Scope (ES)' }),
		defineField({
			name: 'briefEs',
			type: 'object',
			group: 'es',
			title: 'Brief (ES)',
			fields: briefFields()
		}),
		defineField({
			name: 'bodyEs',
			type: 'array',
			group: 'es',
			title: 'Body (ES)',
			description: 'Leave empty to show the English body on the Spanish site.',
			of: bodyMembers()
		}),
		defineField({ name: 'seoTitleEs', type: 'string', group: 'es', title: 'SEO title (ES)' }),
		defineField({
			name: 'seoDescriptionEs',
			type: 'text',
			rows: 2,
			group: 'es',
			title: 'SEO description (ES)'
		}),

		// ── Colour & motion
		defineField({
			name: 'colorScheme',
			type: 'string',
			group: 'look',
			options: { list: ['light', 'dark'], layout: 'radio' },
			initialValue: 'dark'
		}),
		defineField({ name: 'colorAccent', type: 'color', group: 'look' }),
		defineField({ name: 'colorLight', type: 'color', group: 'look' }),
		defineField({ name: 'colorDark', type: 'color', group: 'look' }),
		defineField({ name: 'colorDarkest', type: 'color', group: 'look' }),
		defineField({
			name: 'pageColor',
			type: 'color',
			group: 'look',
			description: 'Page background when the case study opens. Defaults to the scheme colour.'
		}),
		defineField({
			name: 'colorStops',
			type: 'array',
			group: 'look',
			description: 'Changes the page colour as the reader scrolls past a block.',
			of: [
				defineArrayMember({
					type: 'object',
					name: 'colorStop',
					fields: [
						defineField({
							name: 'at',
							type: 'string',
							description: 'The _key of the body block that triggers this colour.'
						}),
						defineField({ name: 'color', type: 'color' }),
						defineField({
							name: 'when',
							type: 'string',
							options: { list: ['cross', 'reveal', 'past', 'center', 'enter'] },
							initialValue: 'cross'
						}),
						defineField({ name: 'line', type: 'number', description: '0–1: how far down the screen' })
					],
					preview: { select: { title: 'at', subtitle: 'when' } }
				})
			]
		}),

		// ── SEO
		defineField({
			name: 'ogImage',
			type: 'image',
			group: 'seo',
			options: { hotspot: true },
			fields: [defineField({ name: 'alt', type: 'string' })]
		}),
		defineField({ name: 'seoTitle', type: 'string', group: 'seo' }),
		defineField({ name: 'seoDescription', type: 'text', rows: 2, group: 'seo' })
	],
	orderings: [
		{ title: 'Sort order', name: 'weightAsc', by: [{ field: 'weight', direction: 'asc' }] }
	],
	preview: {
		select: { title: 'title', hidden: 'hidden', es: 'descriptionEs', media: 'poster' },
		prepare: ({ title, hidden, es, media }) => ({
			title,
			subtitle: [hidden ? 'hidden' : '', es ? '' : 'es-PE missing'].filter(Boolean).join(' · '),
			media
		})
	}
})
