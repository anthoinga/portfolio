export type SkillGroup = {
	id: string
	title: string
	summary: string
	skills: string[]
	/** Case studies (by slug) or site paths that show this skill in use. */
	proof: { slug: string; label: string }[]
	/** The service (see data/services.ts) this group is offered through. */
	serviceId: string
}

type Lang = 'en' | 'es'

const proofLabels = {
	curbside: { en: 'Curbside Pickup', es: 'Curbside Pickup' },
	talent: { en: 'Talent Marketplace', es: 'Talent Marketplace' },
	insurance: { en: 'Insurance Aggregator', es: 'Insurance Aggregator' },
	convenience: { en: 'Conversational Convenience', es: 'Conversational Convenience' },
	site: { en: 'This site and the Playground', es: 'Este sitio y el Playground' },
	playground: { en: 'Playground', es: 'Playground' }
} as const

const p = (slug: string, key: keyof typeof proofLabels, lang: Lang) => ({
	slug,
	label: proofLabels[key][lang]
})

export function skillGroups(lang: Lang): SkillGroup[] {
	const en = lang === 'en'
	return [
		{
			id: 'product-design',
			title: en ? 'Product design' : 'Diseño de producto',
			summary: en
				? 'Turning an unclear problem into flows, screens and a model a team can build against.'
				: 'Convertir un problema difuso en flujos, pantallas y un modelo sobre el cual un equipo pueda construir.',
			skills: en
				? ['Interaction design', 'Information architecture', 'Flows & wireframes', 'Product thinking']
				: ['Diseño de interacción', 'Arquitectura de información', 'Flujos y wireframes', 'Visión de producto'],
			proof: [p('curbside', 'curbside', lang), p('talent', 'talent', lang)],
			serviceId: 'design'
		},
		{
			id: 'research',
			title: en ? 'Research & synthesis' : 'Investigación y síntesis',
			summary: en
				? 'Learning from the people and places the product lives in before drawing anything.'
				: 'Aprender de las personas y los lugares donde vive el producto antes de dibujar nada.',
			skills: en
				? ['Field research', 'Interviews', 'Usability testing', 'Synthesis']
				: ['Investigación en campo', 'Entrevistas', 'Pruebas de usabilidad', 'Síntesis'],
			proof: [p('curbside', 'curbside', lang), p('insurance', 'insurance', lang)],
			serviceId: 'consult'
		},
		{
			id: 'prototyping',
			title: en ? 'Building early' : 'Construir temprano',
			summary: en
				? 'Getting something that behaves like the real thing in front of people early enough to learn from it.'
				: 'Poner algo que se comporte como lo real frente a las personas, lo bastante temprano como para aprender de eso.',
			skills: en
				? ['Working builds', 'Conversational interfaces', 'Rapid iteration', 'Usability sessions']
				: ['Versiones funcionales', 'Interfaces conversacionales', 'Iteración rápida', 'Sesiones de usabilidad'],
			proof: [p('convenience', 'convenience', lang)],
			serviceId: 'build'
		},
		{
			id: 'front-end',
			title: en ? 'Front-end engineering' : 'Ingeniería front-end',
			summary: en
				? 'Shipping the interface in code, including the parts that only exist in motion.'
				: 'Llevar la interfaz a código, incluso las partes que solo existen en movimiento.',
			skills: ['Svelte & SvelteKit', 'TypeScript', 'Tailwind CSS', 'Canvas & Web Audio', en ? 'Component libraries' : 'Librerías de componentes', en ? 'Accessibility' : 'Accesibilidad'],
			proof: [p('/playground', 'site', lang)],
			serviceId: 'build'
		},
		{
			id: 'motion',
			title: en ? 'Motion & interaction' : 'Movimiento e interacción',
			summary: en
				? 'Hand-built transitions, scroll behaviour and feedback that make an interface feel considered.'
				: 'Transiciones, scroll y feedback hechos a mano para que una interfaz se sienta cuidada.',
			skills: en
				? ['Scroll-driven motion', 'Shared-element transitions', 'Micro-interactions', 'Sound design']
				: ['Movimiento con scroll', 'Transiciones entre elementos', 'Microinteracciones', 'Diseño de sonido'],
			proof: [p('/playground', 'playground', lang)],
			serviceId: 'design'
		}
	]
}
