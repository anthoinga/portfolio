/**
 * What is on offer. Short on purpose: a title and a line each, no packages, prices or timelines.
 * The conversation about scope happens after the first message.
 *
 * The buyer is a founder with an app in mind. Prototypes, design systems and the like are part of
 * how the work gets done, not separate things to buy.
 */
type Lang = 'en' | 'es'

export type Service = {
	id: string
	title: string
	summary: string
	/** Case study that shows this kind of work. */
	proof: { slug: string; label: string }
}

export function services(lang: Lang): Service[] {
	const en = lang === 'en'
	return [
		{
			id: 'build',
			title: en ? 'App design & build' : 'Diseño y desarrollo de apps',
			summary: en
				? 'Design, code and launch, from the first sketch to the store.'
				: 'Diseño, código y lanzamiento, desde el primer boceto hasta la tienda.',
			proof: { slug: 'curbside', label: 'Curbside Pickup' }
		},
		{
			id: 'design',
			title: en ? 'Product & interface design' : 'Diseño de producto e interfaz',
			summary: en
				? 'The flows, screens and motion for an app.'
				: 'Los flujos, las pantallas y el movimiento de una app.',
			proof: { slug: 'talent', label: 'Talent Marketplace' }
		},
		{
			id: 'consult',
			title: en ? 'Audit & product consulting' : 'Auditoría y consultoría de producto',
			summary: en
				? 'A close look at a product that isn’t landing, and what to fix first.'
				: 'Una mirada de cerca a un producto que no despega, y qué arreglar primero.',
			proof: { slug: 'insurance', label: 'Insurance Aggregator' }
		}
	]
}
