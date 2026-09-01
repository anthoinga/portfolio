import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { colorInput } from '@sanity/color-input'
import { schemaTypes } from './schemaTypes'
import { deskStructure } from './deskStructure'

const projectId = process.env.SANITY_STUDIO_PROJECT_ID || 'replace-me'
const dataset = process.env.SANITY_STUDIO_DATASET || 'production'

export default defineConfig({
	name: 'work-inga',
	title: 'inga.dev',
	projectId,
	dataset,
	plugins: [structureTool({ structure: deskStructure }), visionTool(), colorInput()],
	schema: { types: schemaTypes }
})
