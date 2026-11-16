import type { Lang } from './core'

type Page = 'playground' | 'skills' | 'workWithMe'

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
			description: 'What I design and build with, and the case studies that show each one in use.'
		},
		es: {
			title: 'Habilidades',
			description: 'Con qué diseño y construyo, y los casos de estudio donde se ve cada una en acción.'
		}
	},
	workWithMe: {
		en: {
			title: 'Services',
			description:
				'Design engineering for agencies and studios: prototype sprints, overflow capacity, design system foundations and UX audits. How we start, how I work, and how to send an enquiry.'
		},
		es: {
			title: 'Servicios',
			description:
				'Design engineering para agencias y estudios: sprints de prototipo, capacidad de refuerzo, bases de design system y auditorías UX. Cómo empezamos, cómo trabajo y cómo enviar una consulta.'
		}
	}
}

export const seoFor = (page: Page, lang: Lang) => seo[page][lang]
