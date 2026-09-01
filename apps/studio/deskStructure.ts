import type { StructureResolver } from 'sanity/structure'

export const deskStructure: StructureResolver = (S) =>
	S.list()
		.title('Content')
		.items([
			S.listItem()
				.title('Site settings')
				.id('siteSettings')
				.child(S.document().schemaType('siteSettings').documentId('siteSettings')),
			S.divider(),
			S.documentTypeListItem('project').title('Projects')
		])
