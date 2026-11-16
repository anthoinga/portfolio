/**
 * Home page copy, one voice per language. Shaped like the `homePage` document
 * the studio gets in the Sanity phase. The Spanish is a draft written for a
 * Peruvian reader, not a translation of the English.
 *
 * Voice, after the structure of the reference site: headlines, labels and buttons are plain, and
 * the role is stated once (the lead). The site itself narrates in short captions at the seams
 * between sections, talking about "him". Each caption is tied to something true on the page.
 */
export type HomeCopy = {
	status: string
	lead: string
	ctaPrimary: string
	ctaSecondary: string
	work: { label: string; note: string }
	services: { label: string; all: string }
	proof: { outcomesLabel: string; recognisedLabel: string; outcomes: { stat: string; label: string }[] }
	playground: { label: string; title: string; all: string }
	cta: { tour: string; title: string; body: string; primary: string; secondary: string }
}

export const homeCopy: Record<'en' | 'es', HomeCopy> = {
	en: {
		// Availability. Add the month here once it is known, e.g. "Available from March".
		status: 'Available for app builds & consulting',
		lead: 'Hello, I’m Anthony. I design and build apps. So far that’s a grocer’s pickup app, a staffing marketplace, an insurance platform and a convenience-store concept.',
		ctaPrimary: 'Contact',
		ctaSecondary: 'See the work',
		work: { label: 'Case studies', note: 'Four of them. I’m not allowed to say whose.' },
		services: { label: 'Services', all: 'Work with me' },
		proof: {
			outcomesLabel: 'Results from past work',
			recognisedLabel: 'Awards',
			outcomes: [
				{ stat: '20%', label: 'faster order fulfilment' },
				{ stat: '40%', label: 'less training time' },
				{ stat: '15%', label: 'better agent task completion' },
				{ stat: '10%', label: 'higher click-through' }
			]
		},
		playground: {
			label: 'Playground',
			title: 'None of this is client work, so none of it is sacred.',
			all: 'Open the playground'
		},
		cta: {
			tour: 'That’s the tour. Anything else, you’ll have to ask him.',
			title: 'Let’s build your app.',
			body: 'App design, a full build or a product audit. Tell me about the app.',
			primary: 'Contact',
			secondary: 'About me'
		}
	},
	es: {
		status: 'Disponible para apps y consultoría',
		lead: 'Hola, soy Anthony. Diseño y construyo apps. Hasta ahora: una app de recojo para un supermercado, un marketplace de personal temporal, una plataforma de seguros y un concepto para tiendas de conveniencia.',
		ctaPrimary: 'Contacto',
		ctaSecondary: 'Ver mi trabajo',
		work: { label: 'Casos de estudio', note: 'Son cuatro. No me dejan decir de quién.' },
		services: { label: 'Servicios', all: 'Trabajemos juntos' },
		proof: {
			outcomesLabel: 'Resultados de trabajos anteriores',
			recognisedLabel: 'Premios',
			outcomes: [
				{ stat: '20%', label: 'más rápido en el despacho de pedidos' },
				{ stat: '40%', label: 'menos tiempo de capacitación' },
				{ stat: '15%', label: 'más tareas completadas por los agentes' },
				{ stat: '10%', label: 'más clics' }
			]
		},
		playground: {
			label: 'Playground',
			title: 'Nada de esto es trabajo para clientes, así que nada es sagrado.',
			all: 'Abrir el playground'
		},
		cta: {
			tour: 'Eso fue el recorrido. Lo demás, pregúntaselo a él.',
			title: 'Hagamos tu app.',
			body: 'Diseño de apps, una construcción completa o una auditoría de producto. Cuéntame de la app.',
			primary: 'Contacto',
			secondary: 'Sobre mí'
		}
	}
}
