/**
 * Home page copy, one voice per language. Shaped like the `homePage` document
 * the studio gets in the Sanity phase. The Spanish is a draft written for a
 * Peruvian reader, not a translation of the English.
 */
export type HomeCopy = {
	status: string
	lead: string
	ctaPrimary: string
	ctaSecondary: string
	work: { label: string }
	playground: { label: string; title: string; all: string }
	principles: { label: string; items: { title: string; body: string }[] }
	cta: { title: string; body: string; primary: string; secondary: string }
}

export const homeCopy: Record<'en' | 'es', HomeCopy> = {
	en: {
		status: 'Open to design-engineering roles',
		lead: 'A creative developer working where design and technology meet: human-computer interaction, media and culture. Technical when it needs to be.',
		ctaPrimary: 'See the work',
		ctaSecondary: 'Get in touch',
		work: { label: 'Case studies' },
		playground: {
			label: 'Playground',
			title: 'Small things I build to learn how an interface should feel.',
			all: 'Open the playground'
		},
		principles: {
			label: 'How I work',
			items: [
				{
					title: 'Design in the medium',
					body: 'I get to something that moves early, so decisions are made on the real thing instead of a picture of it.'
				},
				{
					title: 'Prototype to learn',
					body: 'Research and prototypes feed each other. A rough build that answers a question beats a polished one that does not.'
				},
				{
					title: 'Ship the system',
					body: 'The goal is not one good screen. It is a set of decisions a team can keep building on after I have left the room.'
				}
			]
		},
		cta: {
			title: 'Have something to build?',
			body: 'Whether it is a role, a prototype or a product that needs a clearer shape, I would like to hear about it.',
			primary: 'Work with me',
			secondary: 'Contact'
		}
	},
	es: {
		status: 'Abierto a roles de design engineering',
		lead: 'Creative developer en el cruce entre diseño y tecnología: interacción humano-computadora, medios y cultura. Con código de sobra cuando el proyecto lo pide.',
		ctaPrimary: 'Ver mi trabajo',
		ctaSecondary: 'Escríbeme',
		work: { label: 'Casos de estudio' },
		playground: {
			label: 'Playground',
			title: 'Cosas pequeñas que armo para entender cómo debería sentirse una interfaz.',
			all: 'Abrir el playground'
		},
		principles: {
			label: 'Cómo trabajo',
			items: [
				{
					title: 'Diseñar sobre lo real',
					body: 'Llego rápido a algo que se mueve, para decidir sobre lo real y no sobre una imagen.'
				},
				{
					title: 'Prototipar para aprender',
					body: 'La investigación y los prototipos se alimentan entre sí. Un prototipo a medias que responde una pregunta vale más que uno pulido que no.'
				},
				{
					title: 'Entregar el sistema',
					body: 'La meta no es una pantalla bonita, sino un conjunto de decisiones que el equipo pueda seguir usando cuando yo ya no esté.'
				}
			]
		},
		cta: {
			title: '¿Tienes algo por construir?',
			body: 'Ya sea un puesto, un prototipo o un producto que necesita tomar forma, cuéntame.',
			primary: 'Trabajemos juntos',
			secondary: 'Contacto'
		}
	}
}
