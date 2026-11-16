/**
 * About page copy. Plain and short, and limited to things that are true today. The one mention of
 * the first app lives in "Building now" and says only that it has not been chosen; update that
 * paragraph when it has a name, and add its link. It is deliberately not repeated elsewhere.
 *
 * The Spanish is a draft written for a Peruvian reader, not a translation of the English.
 */
type Lang = 'en' | 'es'

export type AboutCopy = {
	label: string
	title: string
	lead: string
	story: string[]
	building: { label: string; paragraphs: string[] }
	credentialsLabel: string
	elsewhereLabel: string
	cta: { title: string; body: string; button: string }
}

export function aboutCopy(lang: Lang): AboutCopy {
	const en = lang === 'en'
	return en
		? {
				label: 'About',
				title: 'About me',
				lead: 'The short version. There is no long version yet.',
				story: [
					'I’m Anthony Inga, an independent designer and developer.',
					'The case studies are on the Work page. The client names aren’t, for now.',
					'There’s also a Playground of small experiments.'
				],
				building: {
					label: 'Building now',
					paragraphs: ['My own first app. I haven’t picked which one, so there’s nothing to link yet.']
				},
				credentialsLabel: 'Experience',
				elsewhereLabel: 'Elsewhere',
				cta: {
					title: 'Let’s build your app.',
					body: 'App design, a full build or a product audit. Tell me about the app.',
					button: 'Contact'
				}
			}
		: {
				label: 'Sobre mí',
				title: 'Sobre mí',
				lead: 'La versión corta. La larga todavía no existe.',
				story: [
					'Soy Anthony Inga, diseñador y desarrollador independiente.',
					'Los casos de estudio están en Trabajo. Los nombres de los clientes no, por ahora.',
					'También hay un Playground de experimentos pequeños.'
				],
				building: {
					label: 'Lo que estoy construyendo',
					paragraphs: ['Mi propia primera app. Todavía no elijo cuál, así que aún no hay nada que enlazar.']
				},
				credentialsLabel: 'Experiencia',
				elsewhereLabel: 'En otros lugares',
				cta: {
					title: 'Hagamos tu app.',
					body: 'Diseño de apps, una construcción completa o una auditoría de producto. Cuéntame de la app.',
					button: 'Contacto'
				}
			}
}
