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
				lead: 'I’m Anthony Inga, an independent designer and developer.',
				story: [
					'My case studies are on the Work page, with client names withheld.',
					'There’s also a Playground of small experiments.'
				],
				building: {
					label: 'Building now',
					paragraphs: ['My own first app. I haven’t chosen which one yet, so there’s nothing to link.']
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
				lead: 'Soy Anthony Inga, diseñador y desarrollador independiente.',
				story: [
					'Mis casos de estudio están en Trabajo, sin los nombres de los clientes.',
					'También hay un Playground de experimentos pequeños.'
				],
				building: {
					label: 'Lo que estoy construyendo',
					paragraphs: ['Mi primera app propia. Todavía no elijo cuál, así que no hay nada que enlazar.']
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
