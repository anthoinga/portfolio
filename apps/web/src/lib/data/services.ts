export type Service = {
	id: string
	title: string
	summary: string
	deliverables: string[]
}

export function services(lang: 'en' | 'es'): Service[] {
	const en = lang === 'en'
	return [
		{
			id: 'embed',
			title: en ? 'Design engineering, embedded' : 'Design engineering dentro de tu equipo',
			summary: en
				? 'I join your team to design and build interface work in code, so design and engineering move as one loop.'
				: 'Me sumo a tu equipo para diseñar y construir interfaces en código, de modo que diseño e ingeniería avancen juntos.',
			deliverables: en
				? ['Production-ready UI', 'Component and token work', 'Direct collaboration with your engineers']
				: ['UI lista para producción', 'Trabajo en componentes y tokens', 'Colaboración directa con tus ingenieros']
		},
		{
			id: 'prototype',
			title: en ? 'Interactive prototype sprint' : 'Sprint de prototipo interactivo',
			summary: en
				? 'A working prototype in a few weeks, built to test an idea with real people before you commit to building it.'
				: 'Un prototipo funcional en pocas semanas, para probar una idea con personas reales antes de comprometerte a construirla.',
			deliverables: en
				? ['A clickable, behaving prototype', 'Usability findings', 'A recommendation on what to build']
				: ['Un prototipo interactivo que se comporta', 'Hallazgos de usabilidad', 'Una recomendación sobre qué construir']
		},
		{
			id: 'system',
			title: en ? 'Design system foundations' : 'Bases de un design system',
			summary: en
				? 'The starting set of tokens, components and rules a product team can keep growing.'
				: 'El conjunto inicial de tokens, componentes y reglas que tu equipo puede seguir haciendo crecer.',
			deliverables: en
				? ['Tokens and core components', 'Usage documentation', 'A plan for adoption']
				: ['Tokens y componentes base', 'Documentación de uso', 'Un plan de adopción']
		},
		{
			id: 'audit',
			title: en ? 'UX audit and research' : 'Auditoría UX e investigación',
			summary: en
				? 'Find where an existing experience breaks down and what to fix first.'
				: 'Encontrar dónde se rompe una experiencia existente y qué arreglar primero.',
			deliverables: en
				? ['Research and heuristic review', 'Prioritised findings', 'Concrete next steps']
				: ['Investigación y revisión heurística', 'Hallazgos priorizados', 'Siguientes pasos concretos']
		}
	]
}
