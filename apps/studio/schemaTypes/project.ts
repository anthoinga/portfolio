import { defineArrayMember, defineField, defineType } from 'sanity'

export const project = defineType({
	name: 'project',
	title: 'Project',
	type: 'document',
	fields: [
		defineField({ name: 'title', type: 'string', validation: (r) => r.required() }),
		defineField({
			name: 'slug',
			type: 'slug',
			options: { source: 'title' },
			validation: (r) => r.required()
		}),
		defineField({
			name: 'externalUrl',
			title: 'Case study URL',
			type: 'url',
			description: 'Homepage cards open this in a new tab'
		}),
		defineField({ name: 'description', type: 'string', title: 'Tagline' }),
		defineField({ name: 'tags', type: 'array', of: [{ type: 'string' }], options: { layout: 'tags' } }),
		defineField({
			name: 'type',
			type: 'string',
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
		defineField({ name: 'scope', type: 'string', description: 'e.g. 8 weeks (2024)' }),
		defineField({ name: 'year', type: 'number', description: 'Shown on the homepage card pill' }),
		defineField({ name: 'weight', type: 'number', initialValue: 0, description: 'Homepage sort, lower first' }),
		defineField({ name: 'hidden', type: 'boolean', initialValue: false }),
		defineField({
			name: 'colorScheme',
			type: 'string',
			options: { list: ['light', 'dark'], layout: 'radio' },
			initialValue: 'dark'
		}),
		defineField({ name: 'colorAccent', type: 'color' }),
		defineField({ name: 'colorLight', type: 'color' }),
		defineField({ name: 'colorDark', type: 'color' }),
		defineField({ name: 'colorDarkest', type: 'color' }),
		defineField({
			name: 'previewVideo',
			type: 'file',
			options: { accept: 'video/*' },
			description: 'H.264 MP4, ≤10s, compressed before upload. Ambient homepage loop.'
		}),
		defineField({
			name: 'poster',
			type: 'image',
			options: { hotspot: true },
			fields: [{ name: 'alt', type: 'string', title: 'Alt text' }]
		}),
		defineField({
			name: 'ogImage',
			type: 'image',
			options: { hotspot: true },
			fields: [{ name: 'alt', type: 'string' }]
		}),
		defineField({ name: 'seoTitle', type: 'string' }),
		defineField({ name: 'seoDescription', type: 'text', rows: 2 }),
		defineField({
			name: 'nextProject',
			type: 'reference',
			weak: true,
			to: [{ type: 'project' }],
			validation: (Rule) =>
				Rule.custom((value, context) => {
					if (!value?._ref) return true
					const id = context.document?._id?.replace(/^drafts\./, '')
					if (value._ref === id) return 'A project cannot point to itself'
					return true
				})
		}),
		defineField({
			name: 'body',
			type: 'array',
			of: [
				defineArrayMember({ type: 'block' }),
				defineArrayMember({ type: 'fullImage' }),
				defineArrayMember({ type: 'layoutBlock' }),
				defineArrayMember({ type: 'videoBlock' }),
				defineArrayMember({ type: 'team' }),
				defineArrayMember({ type: 'listBlock' }),
				defineArrayMember({ type: 'quoteBlock' }),
				defineArrayMember({ type: 'slideShow' }),
				defineArrayMember({ type: 'spacer' })
			]
		})
	],
	preview: {
		select: { title: 'title', hidden: 'hidden', media: 'poster' },
		prepare: ({ title, hidden, media }) => ({
			title,
			subtitle: hidden ? 'hidden' : '',
			media
		})
	}
})
