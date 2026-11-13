import { defineField, defineType } from 'sanity'

export const siteSettings = defineType({
	name: 'siteSettings',
	title: 'Site settings',
	type: 'document',
	fields: [
		defineField({ name: 'name', type: 'string', validation: (r) => r.required() }),
		defineField({ name: 'role', type: 'string', description: 'One-line role, shown under the name' }),
		defineField({ name: 'bio', type: 'text', rows: 4 }),
		defineField({
			name: 'roleEs',
			type: 'string',
			title: 'Role (Spanish)',
			description: 'Optional. Falls back to the English role.'
		}),
		defineField({
			name: 'bioEs',
			type: 'text',
			rows: 4,
			title: 'Bio (Spanish, Peru)',
			description: 'Write it in your own voice, not word for word. Falls back to the English bio.'
		}),
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
			description: 'Linked from the footer and the Contact page.',
			validation: (r) => r.uri({ allowRelative: true, scheme: ['http', 'https'] })
		}),
		defineField({
			name: 'experiences',
			type: 'array',
			of: [
				{
					type: 'object',
					name: 'credit',
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
					name: 'award',
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
