import type { Lang } from './core'

type Page = 'playground' | 'skills' | 'workWithMe' | 'about'

const seo: Record<Page, Record<Lang, { title: string; description: string }>> = {
	playground: {
		en: {
			title: 'Playground',
			description: 'Small interface experiments: dithering, a dock nav, a forecast widget and a menu.'
		},
		es: {
			title: 'Playground',
			description: 'Experimentos de interfaz: dithering, un dock, un widget de clima y un menú.'
		}
	},
	skills: {
		en: {
			title: 'Skills',
			description: 'What Anthony Inga works with, and the case studies that show each one in use.'
		},
		es: {
			title: 'Habilidades',
			description: 'Con qué trabaja Anthony Inga, y los casos de estudio donde se ve cada una en acción.'
		}
	},
	about: {
		en: {
			title: 'About',
			description:
				'About Anthony Inga, an independent designer and developer: his experience and the work he has done.'
		},
		es: {
			title: 'Sobre mí',
			description:
				'Sobre Anthony Inga, diseñador y desarrollador independiente: su experiencia y el trabajo que ha hecho.'
		}
	},
	workWithMe: {
		en: {
			title: 'Work with me',
			description:
				'Work with Anthony Inga on an app: design and build, product and interface design, or an audit. Send a few lines about your project.'
		},
		es: {
			title: 'Trabajemos juntos',
			description:
				'Trabaja con Anthony Inga en una app: diseño y desarrollo, diseño de producto e interfaz, o una auditoría. Envíale unas líneas sobre tu proyecto.'
		}
	}
}

export const seoFor = (page: Page, lang: Lang) => seo[page][lang]
