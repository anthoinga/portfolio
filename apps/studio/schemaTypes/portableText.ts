import { defineArrayMember, defineField, defineType } from 'sanity'

const captionFields = [
	defineField({ name: 'label', type: 'string' }),
	defineField({ name: 'title', type: 'string' }),
	defineField({ name: 'text', type: 'text', rows: 3 }),
	defineField({ name: 'wideSpacing', type: 'boolean' }),
	defineField({ name: 'overlay', type: 'boolean' }),
	defineField({ name: 'topPadding', type: 'boolean' }),
	defineField({ name: 'fillHeight', type: 'boolean' }),
	defineField({ name: 'rowSpan', type: 'number' })
]

export const mediaItem = defineType({
	name: 'mediaItem',
	title: 'Media item',
	type: 'object',
	fields: [
		defineField({
			name: 'kind',
			type: 'string',
			options: { list: ['image', 'video'], layout: 'radio' },
			initialValue: 'image'
		}),
		defineField({
			name: 'image',
			type: 'image',
			options: { hotspot: true },
			hidden: ({ parent }) => parent?.kind === 'video',
			fields: [{ name: 'alt', type: 'string' }]
		}),
		defineField({
			name: 'video',
			type: 'file',
			options: { accept: 'video/*' },
			hidden: ({ parent }) => parent?.kind !== 'video'
		}),
		defineField({
			name: 'poster',
			type: 'image',
			hidden: ({ parent }) => parent?.kind !== 'video',
			fields: [{ name: 'alt', type: 'string' }]
		}),
		...captionFields
	],
	preview: {
		select: { title: 'title', label: 'label', media: 'image' },
		prepare: ({ title, label, media }) => ({ title: title || label || 'Media', media })
	}
})

export const fullImage = defineType({
	name: 'fullImage',
	title: 'Full image',
	type: 'object',
	fields: [
		defineField({
			name: 'image',
			type: 'image',
			options: { hotspot: true },
			fields: [{ name: 'alt', type: 'string', validation: (r) => r.required() }],
			validation: (r) => r.required()
		}),
		defineField({ name: 'priority', type: 'boolean', initialValue: false })
	],
	preview: { select: { media: 'image', title: 'image.alt' } }
})

export const layoutBlock = defineType({
	name: 'layoutBlock',
	title: 'Layout',
	type: 'object',
	fields: [
		defineField({
			name: 'ratio',
			type: 'string',
			options: {
				list: ['1fr', '1/2', '2/1', '2/3', '3/2', '2/4', '4/2', '3/3']
			},
			initialValue: '1/2'
		}),
		defineField({
			name: 'items',
			type: 'array',
			of: [defineArrayMember({ type: 'mediaItem' })]
		})
	],
	preview: {
		select: { ratio: 'ratio' },
		prepare: ({ ratio }) => ({ title: `Layout ${ratio || ''}` })
	}
})

export const videoBlock = defineType({
	name: 'videoBlock',
	title: 'Video',
	type: 'object',
	fields: [
		defineField({
			name: 'file',
			type: 'file',
			options: { accept: 'video/*' },
			description: 'H.264 MP4, ≤10s, pre-compressed. What you upload is what is served.'
		}),
		defineField({
			name: 'poster',
			type: 'image',
			fields: [{ name: 'alt', type: 'string' }]
		}),
		defineField({ name: 'canScrub', type: 'boolean', initialValue: false }),
		defineField({ name: 'seekOnScroll', type: 'boolean', initialValue: false }),
		defineField({ name: 'width', type: 'number' }),
		defineField({ name: 'height', type: 'number' })
	],
	preview: { select: { title: 'file.asset._ref' }, prepare: () => ({ title: 'Video' }) }
})

export const team = defineType({
	name: 'team',
	title: 'Team',
	type: 'object',
	fields: [
		defineField({
			name: 'members',
			type: 'array',
			of: [
				{
					type: 'object',
					fields: [
						{ name: 'name', type: 'string' },
						{ name: 'position', type: 'string' }
					]
				}
			]
		})
	],
	preview: { prepare: () => ({ title: 'Team' }) }
})

export const listBlock = defineType({
	name: 'listBlock',
	title: 'List',
	type: 'object',
	fields: [
		defineField({
			name: 'items',
			type: 'array',
			of: [
				{
					type: 'object',
					fields: [
						{ name: 'label', type: 'string' },
						{ name: 'text', type: 'text', rows: 3 }
					]
				}
			]
		})
	],
	preview: { prepare: () => ({ title: 'List' }) }
})

export const quoteBlock = defineType({
	name: 'quoteBlock',
	title: 'Quote',
	type: 'object',
	fields: [
		defineField({ name: 'text', type: 'text', rows: 3 }),
		defineField({ name: 'who', type: 'string' }),
		defineField({ name: 'title', type: 'string' })
	],
	preview: { select: { title: 'text', subtitle: 'who' } }
})

export const slideShow = defineType({
	name: 'slideShow',
	title: 'Slideshow',
	type: 'object',
	fields: [
		defineField({ name: 'label', type: 'string' }),
		defineField({ name: 'text', type: 'text', rows: 2 }),
		defineField({
			name: 'slides',
			type: 'array',
			of: [
				{
					type: 'image',
					options: { hotspot: true },
					fields: [{ name: 'alt', type: 'string' }]
				}
			]
		})
	],
	preview: { select: { title: 'label' }, prepare: ({ title }) => ({ title: title || 'Slideshow' }) }
})

export const spacer = defineType({
	name: 'spacer',
	title: 'Spacer',
	type: 'object',
	fields: [],
	preview: { prepare: () => ({ title: 'Spacer' }) }
})
