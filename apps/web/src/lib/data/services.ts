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
				? 'From first sketch to the App Store. Product thinking, interface design and a working build, handed over clean.'
				: 'Del primer boceto a la App Store. Visión de producto, diseño de interfaz y una versión funcional, entregada en orden.',
			proof: { slug: 'curbside', label: 'Curbside Pickup' }
		},
		{
			id: 'design',
			title: en ? 'Product & interface design' : 'Diseño de producto e interfaz',
			summary: en
				? 'Flows, screens and motion for an app, grounded in what people need and designed to be built.'
				: 'Flujos, pantallas y movimiento para una app, basados en lo que la gente necesita y diseñados para construirse.',
			proof: { slug: 'talent', label: 'Talent Marketplace' }
		},
		{
			id: 'consult',
			title: en ? 'Audit & product consulting' : 'Auditoría y consultoría de producto',
			summary: en
				? 'A close look at a product that isn’t landing: where people drop off, what to fix first and a plan your team can act on.'
				: 'Una mirada de cerca a un producto que no despega: dónde se va la gente, qué arreglar primero y un plan que tu equipo pueda ejecutar.',
			proof: { slug: 'insurance', label: 'Insurance Aggregator' }
		}
	]
}
