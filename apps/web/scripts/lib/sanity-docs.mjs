/**
 * Turns the site's content (the TypeScript fixtures it was built from) into
 * Sanity documents. Used by both the real export and the offline verification,
 * so the two can never describe different data.
 *
 * `asset(url, kind)` decides how a media URL becomes an asset reference:
 *  - export: `{ _sanityAsset: 'image@file:///…' }`, which `sanity dataset import` uploads
 *  - verify: `{ _ref: 'image-…' }` pointing at a synthetic asset document
 */
const color = (value) => {
	const hex = typeof value === 'string' ? value : value?.hex
	return hex ? { _type: 'color', hex, alpha: 1 } : undefined
}
const clean = (obj) => Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined && v !== null))

export function buildDocuments({ settings, settingsEs, projects, asset }) {
	const image = (m) => (m?.url ? clean({ _type: 'image', asset: asset(m.url, 'image'), alt: m.alt }) : undefined)
	const file = (m) => (m?.url ? { _type: 'file', asset: asset(m.url, 'file') } : undefined)

	function mediaItem(it, key) {
		const { image: i, video: v, poster: p, ...rest } = it
		return clean({
			...rest,
			_type: 'mediaItem',
			_key: it._key ?? key,
			image: image(i),
			video: file(v),
			poster: image(p)
		})
	}

	function block(b, i) {
		const key = b._key ?? `b-${i}`
		switch (b._type) {
			case 'fullImage':
				return clean({ ...b, _key: key, image: image(b.image) })
			case 'layoutBlock':
				return { ...b, _key: key, items: b.items.map((it, n) => mediaItem(it, `${key}-${n}`)) }
			case 'videoBlock':
				return clean({ ...b, _key: key, file: file(b.file), poster: image(b.poster) })
			case 'slideShow':
				return clean({
					...b,
					_key: key,
					slides: (b.slides ?? []).map((s, n) => ({ ...image(s), _key: `${key}-${n}` }))
				})
			case 'team':
				return { ...b, _key: key, members: b.members.map((m, n) => ({ _type: 'teamMember', _key: `${key}-${n}`, ...m })) }
			case 'listBlock':
				return { ...b, _key: key, items: b.items.map((m, n) => ({ _type: 'listItem', _key: `${key}-${n}`, ...m })) }
			case 'block':
				return { markDefs: [], style: 'normal', ...b, _key: key }
			default:
				return { ...b, _key: key }
		}
	}

	const brief = (b) =>
		b && {
			paragraphs: b.paragraphs,
			facts: (b.facts ?? []).map((f, n) => ({ _type: 'fact', _key: `fact-${n}`, label: f.label, items: f.items }))
		}

	const credits = (rows, type) => (rows ?? []).map((r, n) => clean({ _type: type, _key: `${type}-${n}`, ...r }))

	const docs = [
		clean({
			_id: 'siteSettings',
			_type: 'siteSettings',
			name: settings.name,
			role: settings.role,
			bio: settings.bio,
			roleEs: settingsEs?.role,
			bioEs: settingsEs?.bio,
			email: settings.email,
			github: settings.github,
			linkedin: settings.linkedin,
			cv: settings.cv,
			experiences: credits(settings.experiences, 'credit'),
			awards: credits(settings.awards, 'award')
		})
	]

	for (const p of projects) {
		docs.push(
			clean({
				_id: p._id,
				_type: 'project',
				title: p.title,
				slug: { _type: 'slug', current: p.slug },
				description: p.description,
				tags: p.tags,
				type: p.type,
				scope: p.scope,
				year: p.year,
				weight: p.weight,
				hidden: p.hidden,
				colorScheme: p.colorScheme,
				colorAccent: color(p.colorAccent),
				colorLight: color(p.colorLight),
				colorDark: color(p.colorDark),
				colorDarkest: color(p.colorDarkest),
				pageColor: color(p.pageColor),
				colorStops: (p.colorStops ?? []).map((s, n) =>
					clean({ _type: 'colorStop', _key: `stop-${n}`, at: s.at, color: color(s.color), when: s.when, line: s.line })
				),
				previewVideo: file(p.previewVideo),
				poster: image(p.poster),
				ogImage: image(p.ogImage),
				seoTitle: p.seoTitle,
				seoDescription: p.seoDescription,
				brief: brief(p.brief),
				nextProject: p.nextProject?._id
					? { _type: 'reference', _ref: p.nextProject._id, _weak: true }
					: undefined,
				body: (p.body ?? []).map(block)
			})
		)
	}
	return docs
}
