import type { Lang } from './core'

type Page = 'work' | 'playground' | 'skills' | 'workWithMe' | 'contact'

const seo: Record<Page, Record<Lang, { title: string; description: string }>> = {
	work: {
		en: { title: 'Work', description: 'Case studies in product design, research and prototyping.' },
		es: {
			title: 'Trabajo',
			description: 'Casos de estudio de diseño de producto, investigación y prototipado.'
		}
	},
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
			title: 'Work with me',
			description:
				'Ways to work together: embedded design engineering, prototype sprints, design systems and UX audits.'
		},
		es: {
			title: 'Trabajemos',
			description:
				'Formas de trabajar juntos: design engineering dentro de tu equipo, sprints de prototipo, design systems y auditorías UX.'
		}
	},
	contact: {
		en: {
			title: 'Contact',
			description: 'Get in touch about roles, prototypes and product design work.'
		},
		es: {
			title: 'Contacto',
			description: 'Escríbeme para hablar de roles, prototipos y proyectos de diseño de producto.'
		}
	}
}

export const seoFor = (page: Page, lang: Lang) => seo[page][lang]
