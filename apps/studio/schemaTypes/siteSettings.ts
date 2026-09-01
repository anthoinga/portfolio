import { defineField, defineType } from 'sanity'

export const siteSettings = defineType({
	name: 'siteSettings',
	title: 'Site settings',
	type: 'document',
	fields: [
		defineField({ name: 'name', type: 'string', validation: (r) => r.required() }),
		defineField({ name: 'role', type: 'string', description: 'One-line role, shown under the name' }),
		defineField({ name: 'bio', type: 'text', rows: 4 }),
		defineField({ name: 'email', type: 'string' }),
		defineField({
			name: 'github',
			type: 'url',
			validation: (r) => r.uri({ allowRelative: true, scheme: ['http', 'https'] })
		}),
		defineField({
			name: 'linkedin',
			type: 'url',
			validation: (r) => r.uri({ allowRelative: true, scheme: ['http', 'https'] })
		}),
		defineField({
			name: 'cv',
			title: 'Curriculum Vitae',
			type: 'url',
			description: 'Opens in a new tab from the left-rail footer.',
			validation: (r) => r.uri({ allowRelative: true, scheme: ['http', 'https'] })
		}),
		defineField({
			name: 'experiences',
			type: 'array',
			of: [
				{
					type: 'object',
					fields: [
						{ name: 'org', type: 'string' },
						{ name: 'role', type: 'string' },
						{ name: 'years', type: 'string' }
					],
					preview: { select: { title: 'org', subtitle: 'role' } }
				}
			]
		}),
		defineField({
			name: 'awards',
			type: 'array',
			of: [
				{
					type: 'object',
					fields: [
						{ name: 'org', type: 'string', title: 'Award' },
						{ name: 'role', type: 'string', title: 'Year' }
					],
					preview: { select: { title: 'org', subtitle: 'role' } }
				}
			]
		}),
		defineField({
			name: 'analyticsId',
			type: 'string',
			description: 'Optional. Leave empty to skip analytics.'
		})
	],
	preview: { select: { title: 'name' } }
})
