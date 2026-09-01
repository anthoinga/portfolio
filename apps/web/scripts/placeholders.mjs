import { writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const dir = join(dirname(fileURLToPath(import.meta.url)), '../static/placeholders')
mkdirSync(dir, { recursive: true })

function svg({ bg, fg, accent, label }) {
	return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1000" role="img" aria-label="${label}">
  <rect width="1600" height="1000" fill="${bg}"/>
  <rect x="80" y="80" width="1440" height="840" fill="none" stroke="${fg}" stroke-opacity="0.12" stroke-width="2"/>
  <circle cx="1180" cy="320" r="180" fill="${accent}" fill-opacity="0.85"/>
  <rect x="160" y="620" width="720" height="18" fill="${fg}" fill-opacity="0.35"/>
  <rect x="160" y="660" width="480" height="18" fill="${fg}" fill-opacity="0.18"/>
</svg>`
}

const files = {
	'atlas.svg': { bg: '#0d140b', fg: '#e8f5d4', accent: '#c4f06a', label: 'Atlas poster' },
	'atlas-a.svg': { bg: '#243322', fg: '#e8f5d4', accent: '#9bbf4a', label: 'Atlas detail A' },
	'atlas-b.svg': { bg: '#152016', fg: '#e8f5d4', accent: '#d7ff8a', label: 'Atlas detail B' },
	'atlas-video.svg': { bg: '#0d140b', fg: '#e8f5d4', accent: '#c4f06a', label: 'Atlas video poster' },
	'night.svg': { bg: '#0c0918', fg: '#f7e6cf', accent: '#f2b56b', label: 'Night Bus poster' },
	'night-hero.svg': { bg: '#1b1630', fg: '#f7e6cf', accent: '#f2b56b', label: 'Night Bus hero' },
	'night-1.svg': { bg: '#16112a', fg: '#f7e6cf', accent: '#e89a3a', label: 'Night slide 1' },
	'night-2.svg': { bg: '#120e22', fg: '#f7e6cf', accent: '#f2b56b', label: 'Night slide 2' },
	'night-3.svg': { bg: '#0a0714', fg: '#f7e6cf', accent: '#ffd19a', label: 'Night slide 3' },
	'night-a.svg': { bg: '#211a3a', fg: '#f7e6cf', accent: '#f2b56b', label: 'Night detail A' },
	'night-b.svg': { bg: '#14102a', fg: '#f7e6cf', accent: '#c9843d', label: 'Night detail B' },
	'glass.svg': { bg: '#f3f6ff', fg: '#1a2340', accent: '#3a6bff', label: 'Glass Radio poster' },
	'glass-video.svg': { bg: '#e4eafc', fg: '#1a2340', accent: '#3a6bff', label: 'Glass Radio video poster' },
	'field.svg': { bg: '#f6efe6', fg: '#3a2a1f', accent: '#c45c26', label: 'Field Notes poster' },
	'field-hero.svg': { bg: '#efe4d4', fg: '#3a2a1f', accent: '#c45c26', label: 'Field Notes hero' },
	'hidden.svg': { bg: '#140e18', fg: '#efe6f4', accent: '#c9a0d8', label: 'Hidden poster' },
	'hidden-hero.svg': { bg: '#2a1d30', fg: '#efe6f4', accent: '#c9a0d8', label: 'Hidden hero' }
}

for (const [name, spec] of Object.entries(files)) {
	writeFileSync(join(dir, name), svg(spec))
}

console.log(`wrote ${Object.keys(files).length} placeholders`)
