/**
 * Home page copy, one voice per language. Shaped like the `homePage` document
 * the studio gets in the Sanity phase. The Spanish is a draft written for a
 * Peruvian reader, not a translation of the English.
 *
 * The site sells independent design-engineering services to agencies and studios, so the copy
 * speaks to a buyer: what they get, who it is for, how to start.
 */
export type HomeCopy = {
	status: string
	lead: string
	/** One line under the buttons: the easiest way to begin. */
	entry: string
	ctaPrimary: string
	ctaSecondary: string
	work: { label: string }
	services: { label: string; all: string }
	proof: { outcomesLabel: string; recognisedLabel: string; outcomes: { stat: string; label: string }[] }
	playground: { label: string; title: string; all: string }
	principles: { label: string; items: { title: string; body: string }[] }
	cta: { title: string; body: string; primary: string; secondary: string }
}

export const homeCopy: Record<'en' | 'es', HomeCopy> = {
	en: {
		// Availability. Add the month here once it is known, e.g. "Booking agency projects from March".
		status: 'Taking on agency projects',
		lead: 'I am a design engineer for agencies and studios. I design and build interface work in code, under your brand and inside your process, so your client sees something real early.',
		entry: 'Most agencies start with a 2–3 week prototype sprint.',
		ctaPrimary: 'Start a project',
		ctaSecondary: 'See the work',
		work: { label: 'Case studies' },
		services: { label: 'Services', all: 'See how we work' },
		proof: {
			outcomesLabel: 'Results from past work',
			recognisedLabel: 'Recognised by',
			outcomes: [
				{ stat: '20%', label: 'faster order fulfilment' },
				{ stat: '40%', label: 'less training time' },
				{ stat: '15%', label: 'better agent task completion' },
				{ stat: '10%', label: 'higher click-through' }
			]
		},
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
					body: 'I get to something that moves early, so your client reacts to the real thing instead of a picture of it.'
				},
				{
					title: 'Prototype to learn',
					body: 'Research and prototypes feed each other. A rough build that answers a question beats a polished one that does not.'
				},
				{
					title: 'Leave your team a system',
					body: 'The goal is not one good screen. It is a set of decisions your team can keep building on after the engagement ends.'
				}
			]
		},
		cta: {
			title: 'Have a project to scope or staff?',
			body: 'Tell me what you are building and when. I will tell you whether I can help and how we would start.',
			primary: 'Start a project',
			secondary: 'See the services'
		}
	},
	es: {
		status: 'Tomando proyectos de agencias',
		lead: 'Soy design engineer para agencias y estudios. Diseño y construyo interfaces en código, bajo tu marca y dentro de tu proceso, para que tu cliente vea algo real desde temprano.',
		entry: 'La mayoría de las agencias empieza con un sprint de prototipo de 2–3 semanas.',
		ctaPrimary: 'Iniciar un proyecto',
		ctaSecondary: 'Ver mi trabajo',
		work: { label: 'Casos de estudio' },
		services: { label: 'Servicios', all: 'Ver cómo trabajamos' },
		proof: {
			outcomesLabel: 'Resultados de trabajos anteriores',
			recognisedLabel: 'Reconocido por',
			outcomes: [
				{ stat: '20%', label: 'más rápido en el despacho de pedidos' },
				{ stat: '40%', label: 'menos tiempo de capacitación' },
				{ stat: '15%', label: 'más tareas completadas por los agentes' },
				{ stat: '10%', label: 'más clics' }
			]
		},
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
					body: 'Llego rápido a algo que se mueve, para que tu cliente reaccione a lo real y no a una imagen.'
				},
				{
					title: 'Prototipar para aprender',
					body: 'La investigación y los prototipos se alimentan entre sí. Un prototipo a medias que responde una pregunta vale más que uno pulido que no.'
				},
				{
					title: 'Dejarle un sistema a tu equipo',
					body: 'La meta no es una pantalla bonita, sino un conjunto de decisiones que tu equipo pueda seguir usando cuando termine el trabajo.'
				}
			]
		},
		cta: {
			title: '¿Tienes un proyecto por definir o reforzar?',
			body: 'Cuéntame qué estás construyendo y para cuándo. Te digo si puedo ayudar y cómo empezaríamos.',
			primary: 'Iniciar un proyecto',
			secondary: 'Ver los servicios'
		}
	}
}
