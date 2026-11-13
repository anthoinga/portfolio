import type { MediaItem, PortableBlock, Project } from '$lib/sanity/types'

type Abs = (url: string) => string

const clean = (s: string) => s.replace(/\s+/g, ' ').trim()

function spans(children: { text: string; marks?: string[] }[] = []) {
	return children
		.map((c) => {
			const text = c.text ?? ''
			if (!text.trim()) return text
			if (c.marks?.includes('strong')) return `**${text}**`
			if (c.marks?.includes('em')) return `*${text}*`
			return text
		})
		.join('')
}

function image(img: { url: string; alt?: string } | null | undefined, abs: Abs) {
	return img?.url ? `![${clean(img.alt ?? '')}](${abs(img.url)})` : ''
}

function item(it: MediaItem, abs: Abs): string {
	if (it.kind === 'copy') {
		return [it.heading ? `### ${it.heading}` : '', ...(it.paragraphs ?? [])].filter(Boolean).join('\n\n')
	}
	const media =
		it.kind === 'video'
			? it.video?.url
				? `[Video: ${clean(it.title ?? it.poster?.alt ?? 'demo')}](${abs(it.video.url)})`
				: ''
			: image(it.image, abs)
	const caption = [it.label, it.title, it.text].filter(Boolean).join(' — ')
	return [media, caption ? `*${caption}*` : ''].filter(Boolean).join('\n\n')
}

/** Portable Text → Markdown. Unknown block types are skipped rather than guessed at. */
export function blocksToMarkdown(blocks: PortableBlock[], abs: Abs): string {
	const out: string[] = []
	for (const b of blocks) {
		switch (b._type) {
			case 'block': {
				const text = clean(spans(b.children))
				if (!text) break
				out.push(b.style === 'h2' ? `## ${text}` : b.style === 'h3' ? `### ${text}` : text)
				break
			}
			case 'fullImage':
				out.push(image(b.image, abs))
				break
			case 'layoutBlock':
				out.push(...b.items.map((it) => item(it, abs)))
				break
			case 'videoBlock':
				if (b.file?.url) out.push(`[Video: ${clean(b.poster?.alt ?? 'demo')}](${abs(b.file.url)})`)
				break
			case 'quoteBlock':
				out.push(
					`> ${clean(b.text)}` + (b.who ? `\n>\n> — ${[b.who, b.title].filter(Boolean).join(', ')}` : '')
				)
				break
			case 'team':
				out.push(b.members.map((m) => `- ${m.name}${m.position ? ` — ${m.position}` : ''}`).join('\n'))
				break
			case 'listBlock':
				out.push(b.items.map((i) => `- ${[i.label && `**${i.label}**`, i.text].filter(Boolean).join(' ')}`).join('\n'))
				break
			case 'slideShow':
				out.push(
					[b.label, b.text].filter(Boolean).join(' — '),
					b.slides.map((s) => image(s, abs)).filter(Boolean).join('\n\n')
				)
				break
			default:
				break
		}
	}
	return out.filter(Boolean).join('\n\n')
}

/** A case study as Markdown: summary, facts from the brief, then the full body. */
export function projectMarkdown(p: Project, abs: Abs): string {
	const facts = (p.brief?.facts ?? []).map((f) => `- **${f.label}:** ${f.items.join(', ')}`)
	const meta = [
		p.scope && `- **Scope:** ${p.scope}`,
		p.year && `- **Year:** ${p.year}`,
		p.tags?.length && `- **Tags:** ${p.tags.join(', ')}`
	].filter(Boolean) as string[]
	return [
		p.description ?? '',
		meta.join('\n'),
		facts.join('\n'),
		blocksToMarkdown(p.body ?? [], abs)
	]
		.filter(Boolean)
		.join('\n\n')
}
