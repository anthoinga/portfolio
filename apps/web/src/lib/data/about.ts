/**
 * About page copy. Its structure follows the reference site's About page: 01 About, 02 Leadership
 * (team sizes, how I work with a team, an optional testimonial), 03 How I design for AI (the
 * techniques, the rules, the ethics, the toolkit).
 *
 * Everything here has to be true. Each item comes from a case study on this site or from how the
 * site itself is built:
 * - Leadership: Curbside (a team of ten; led the follow-on edge-case projects), Talent (a two-person
 *   team), Conversational Convenience (one research partner), Insurance (focus groups, Figma to
 *   Storybook, checking changes against both audiences).
 * - Techniques and rules: the Conversational Convenience case study.
 * - The agent rule and the ethics: this site (llms.txt and the JSON API, the privacy page, the axe
 *   audit in scripts/smoke.mjs, reduced-motion handling, client names withheld).
 * - Toolkit: package.json, the case studies, and the tools that built this site.
 *
 * `testimonial` is empty until there is a real quote with permission to use it.
 * The one mention of the first app lives in "Building now"; update it when the app has a name.
 * The Spanish is a draft written for a Peruvian reader, not a translation of the English.
 */
type Lang = 'en' | 'es'

export type Item = { title: string; body: string }
export type LinkItem = Item & { links?: { label: string; href: string }[] }

export type AboutCopy = {
	label: string
	title: string
	lead: string
	aboutLabel: string
	story: string[]
	building: { label: string; paragraphs: string[] }
	credentialsLabel: string
	leadership: {
		label: string
		intro: string
		teams: Item[]
		transition: string
		practices: Item[]
		testimonial: { quote: string; name: string; role: string } | null
	}
	ai: {
		label: string
		intro: string
		techniques: { label: string; lead: string; items: Item[] }
		rules: { lead: string; items: LinkItem[] }
		ethics: { label: string; lead: string; items: LinkItem[] }
		toolkit: { label: string; lead: string; groups: { title: string; items: string[] }[] }
	}
	elsewhereLabel: string
	cta: { title: string; body: string; button: string }
}

const CONVENIENCE = '/projects/convenience'

/** Tool names stay in English in both languages. */
const toolkit = (en: boolean) => [
	{
		title: en ? 'Building' : 'Construcción',
		items: ['SvelteKit', 'Svelte 5', 'TypeScript', 'Vite', 'Sanity', 'Vercel', 'Claude Code', 'Cursor']
	},
	{
		title: en ? 'Interface and motion' : 'Interfaz y movimiento',
		items: ['Tailwind CSS', 'Canvas 2D', 'Web Audio', en ? 'Scroll-driven animation' : 'Animación con scroll']
	},
	{
		title: en ? 'Design' : 'Diseño',
		items: ['Figma', 'FigJam', 'Storybook']
	},
	{
		title: en ? 'Testing and quality' : 'Pruebas y calidad',
		items: ['Playwright', 'axe-core', 'svelte-check']
	}
]

export function aboutCopy(lang: Lang): AboutCopy {
	const en = lang === 'en'
	return en
		? {
				label: 'About',
				title: 'About me',
				lead: 'I’m Anthony Inga, an independent designer and developer.',
				aboutLabel: 'About',
				story: [
					'My case studies are on the Work page, with client names withheld.',
					'There’s also a Playground of small experiments.'
				],
				building: {
					label: 'Building now',
					paragraphs: ['My own first app. I haven’t chosen which one yet, so there’s nothing to link.']
				},
				credentialsLabel: 'Experience',
				leadership: {
					label: 'Leadership',
					intro: 'I’ve led projects on a team of ten, and been one half of a team of two. Each works differently.',
					teams: [
						{
							title: 'A team of 10',
							body: 'Designers, architects, engineers and a PM on Curbside Pickup. Once the core app shipped, I led the follow-on projects for the edge cases stores kept hitting.'
						},
						{
							title: 'A team of 2',
							body: 'On Talent Marketplace, and with one research partner on Conversational Convenience. Small enough that design and decisions happen in the same conversation.'
						}
					],
					transition: 'How I work with a team, whatever its size.',
					practices: [
						{
							title: 'Go where it’s used',
							body: 'I shadowed store staff across locations before designing a single screen for curbside pickup.'
						},
						{
							title: 'Spec it to the tick mark',
							body: 'Interaction specs go down to the detail: where a slider starts, and how its label changes as you drag.'
						},
						{
							title: 'One library, design to code',
							body: 'Components are designed in Figma and built in Storybook, so engineers reuse them instead of rebuilding them.'
						},
						{
							title: 'Test with the people who use it',
							body: 'Clickable builds go in front of real users early, and I fix what slows them down before launch.'
						},
						{
							title: 'Check every change against both sides',
							body: 'When two audiences share one system, nothing ships until it works for both of them.'
						}
					],
					testimonial: null
				},
				ai: {
					label: 'How I design for AI',
					intro: 'Most of what I know here comes from designing conversational search for a convenience retailer, and from building this site for agents to read.',
					techniques: {
						label: 'The techniques',
						lead: 'What I do before a model touches anything.',
						items: [
							{
								title: 'Start with how people already use it',
								body: 'Before sketching search, we mapped how shoppers already use AI. It showed up for cars and trips, not for a quick snack run.'
							},
							{
								title: 'Run it past an adoption check',
								body: 'We used UTAUT as a checklist: is it useful, is it easy, would people around you find it normal, can the store’s systems support it?'
							},
							{
								title: 'Design for the vague request',
								body: 'Short requests carry more than one meaning. “I need to refuel” can mean gas or coffee, so the design has to hold both.'
							},
							{
								title: 'Keep the whole catalogue in reach',
								body: 'A chat that returns three picks hides the rest of the store. Results reorganise the catalogue instead of replacing it.'
							},
							{
								title: 'Plan for the data you actually have',
								body: 'Tags are brittle, inventory lags the shelf and personal signals may not be connected. The core interaction has to work without them.'
							}
						]
					},
					rules: {
						lead: 'AI earns trust when it suggests instead of deciding, and is honest about its guesses. Six rules I design by.',
						items: [
							{
								title: 'It suggests, it doesn’t decide',
								body: 'People were clear that automatic buying crosses a line. Search can suggest and rearrange; the choice stays with the person.',
								links: [{ label: 'Conversational Convenience', href: CONVENIENCE }]
							},
							{
								title: 'Several readings, not one guess',
								body: 'A request becomes a few labelled rows, each a plausible reading, so a wrong guess is obvious and easy to scroll past.',
								links: [{ label: 'Conversational Convenience', href: CONVENIENCE }]
							},
							{
								title: 'Ask only when it changes the answer',
								body: 'A follow-up question is worth it only if the answer would change what shows up. Otherwise, lead with the best guess.',
								links: [{ label: 'Conversational Convenience', href: CONVENIENCE }]
							},
							{
								title: 'Explain the grouping',
								body: 'Copy says why things are grouped together, instead of claiming to know the person.',
								links: [{ label: 'Conversational Convenience', href: CONVENIENCE }]
							},
							{
								title: 'Don’t invent completeness',
								body: 'When matches are weak, the empty state says so instead of padding the results.',
								links: [{ label: 'Conversational Convenience', href: CONVENIENCE }]
							},
							{
								title: 'Readable by agents, on purpose',
								body: 'This site publishes plain text, Markdown and a JSON API, with no key or signup, so an agent can read it without scraping.',
								links: [{ label: 'For developers', href: '/developers' }]
							}
						]
					},
					ethics: {
						label: 'The ethics',
						lead: 'The lines I hold.',
						items: [
							{
								title: 'Collect as little as possible',
								body: 'This site has no ads, no trackers and no cookies. Preferences stay in your browser.',
								links: [{ label: 'Privacy', href: '/privacy' }]
							},
							{
								title: 'Clients stay confidential',
								body: 'I don’t name a client or show their work without written permission.'
							},
							{
								title: 'Accessible by default',
								body: 'Every page is checked with an automated accessibility audit, and motion follows your reduced-motion setting.'
							},
							{
								title: 'Honest about the limits',
								body: 'A concept shouldn’t imply the data or systems behind it are better than they are. I write the limits down.'
							}
						]
					},
					toolkit: {
						label: 'The toolkit',
						lead: 'What I build with.',
						groups: toolkit(true)
					}
				},
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
				aboutLabel: 'Sobre mí',
				story: [
					'Mis casos de estudio están en Trabajo, sin los nombres de los clientes.',
					'También hay un Playground de experimentos pequeños.'
				],
				building: {
					label: 'Lo que estoy construyendo',
					paragraphs: ['Mi primera app propia. Todavía no elijo cuál, así que no hay nada que enlazar.']
				},
				credentialsLabel: 'Experiencia',
				leadership: {
					label: 'Liderazgo',
					intro: 'He liderado proyectos en un equipo de diez y he sido la mitad de un equipo de dos. Cada uno funciona distinto.',
					teams: [
						{
							title: 'Un equipo de 10',
							body: 'Diseñadores, arquitectos, ingenieros y un PM en Curbside Pickup. Cuando la app principal salió, lideré los proyectos que siguieron para los casos límite que las tiendas seguían encontrando.'
						},
						{
							title: 'Un equipo de 2',
							body: 'En Talent Marketplace, y con una sola persona de investigación en Conversational Convenience. Lo bastante pequeño para que el diseño y las decisiones ocurran en la misma conversación.'
						}
					],
					transition: 'Cómo trabajo con un equipo, sea del tamaño que sea.',
					practices: [
						{
							title: 'Ir a donde se usa',
							body: 'Acompañé al personal de varias tiendas antes de diseñar una sola pantalla para el recojo en tienda.'
						},
						{
							title: 'Especificar hasta el detalle',
							body: 'Las especificaciones de interacción llegan al detalle: dónde empieza un slider y cómo cambia su etiqueta al arrastrarlo.'
						},
						{
							title: 'Una librería, del diseño al código',
							body: 'Los componentes se diseñan en Figma y se construyen en Storybook, para que los ingenieros los reutilicen en vez de rehacerlos.'
						},
						{
							title: 'Probar con quienes lo usan',
							body: 'Las versiones clicables llegan pronto a usuarios reales, y arreglo lo que los frena antes del lanzamiento.'
						},
						{
							title: 'Revisar cada cambio por ambos lados',
							body: 'Cuando dos públicos comparten un sistema, nada sale hasta que funciona para los dos.'
						}
					],
					testimonial: null
				},
				ai: {
					label: 'Cómo diseño para IA',
					intro: 'Casi todo lo que sé aquí viene de diseñar búsqueda conversacional para una cadena de tiendas de conveniencia, y de construir este sitio para que lo lean agentes.',
					techniques: {
						label: 'Las técnicas',
						lead: 'Lo que hago antes de que un modelo toque nada.',
						items: [
							{
								title: 'Empezar por cómo la gente ya lo usa',
								body: 'Antes de bocetar la búsqueda, mapeamos cómo los compradores ya usan la IA. Aparecía para autos y viajes, no para comprar un snack rápido.'
							},
							{
								title: 'Pasarlo por un filtro de adopción',
								body: 'Usamos UTAUT como lista: ¿es útil, es fácil, le parecería normal a la gente de tu entorno, lo soportan los sistemas de la tienda?'
							},
							{
								title: 'Diseñar para el pedido vago',
								body: 'Los pedidos cortos tienen más de un significado. “Necesito recargar” puede ser gasolina o café, así que el diseño tiene que sostener ambos.'
							},
							{
								title: 'Mantener todo el catálogo a mano',
								body: 'Un chat que devuelve tres opciones esconde el resto de la tienda. Los resultados reordenan el catálogo en vez de reemplazarlo.'
							},
							{
								title: 'Planear con los datos que realmente hay',
								body: 'Las etiquetas fallan, el inventario va detrás del estante y las señales personales quizá no estén conectadas. La interacción principal tiene que funcionar sin ellas.'
							}
						]
					},
					rules: {
						lead: 'La IA se gana la confianza cuando sugiere en vez de decidir, y es honesta sobre sus suposiciones. Seis reglas con las que diseño.',
						items: [
							{
								title: 'Sugiere, no decide',
								body: 'La gente fue clara: comprar en automático cruza una línea. La búsqueda puede sugerir y reordenar; la decisión sigue siendo de la persona.',
								links: [{ label: 'Conversational Convenience', href: CONVENIENCE }]
							},
							{
								title: 'Varias lecturas, no una suposición',
								body: 'Un pedido se convierte en unas pocas filas con nombre, cada una una lectura posible, así que una suposición equivocada salta a la vista y se pasa de largo.',
								links: [{ label: 'Conversational Convenience', href: CONVENIENCE }]
							},
							{
								title: 'Preguntar solo si cambia la respuesta',
								body: 'Una pregunta de seguimiento vale la pena solo si la respuesta cambiaría lo que aparece. Si no, se empieza por la mejor suposición.',
								links: [{ label: 'Conversational Convenience', href: CONVENIENCE }]
							},
							{
								title: 'Explicar la agrupación',
								body: 'El texto dice por qué las cosas están agrupadas, en vez de afirmar que conoce a la persona.',
								links: [{ label: 'Conversational Convenience', href: CONVENIENCE }]
							},
							{
								title: 'No inventar resultados completos',
								body: 'Cuando las coincidencias son débiles, el estado vacío lo dice en vez de rellenar los resultados.',
								links: [{ label: 'Conversational Convenience', href: CONVENIENCE }]
							},
							{
								title: 'Legible para agentes, a propósito',
								body: 'Este sitio publica texto plano, Markdown y una API JSON, sin key ni registro, para que un agente lo lea sin hacer scraping.',
								links: [{ label: 'Para desarrolladores', href: '/developers' }]
							}
						]
					},
					ethics: {
						label: 'La ética',
						lead: 'Las líneas que mantengo.',
						items: [
							{
								title: 'Recoger lo mínimo',
								body: 'Este sitio no tiene anuncios, ni rastreadores, ni cookies. Tus preferencias se quedan en tu navegador.',
								links: [{ label: 'Privacidad', href: '/privacy' }]
							},
							{
								title: 'Los clientes son confidenciales',
								body: 'No nombro a un cliente ni muestro su trabajo sin permiso por escrito.'
							},
							{
								title: 'Accesible por defecto',
								body: 'Cada página pasa por una auditoría automática de accesibilidad, y el movimiento respeta tu ajuste de movimiento reducido.'
							},
							{
								title: 'Honesto con los límites',
								body: 'Un concepto no debería dar a entender que los datos o sistemas detrás son mejores de lo que son. Dejo los límites por escrito.'
							}
						]
					},
					toolkit: {
						label: 'Las herramientas',
						lead: 'Con qué construyo.',
						groups: toolkit(false)
					}
				},
				elsewhereLabel: 'En otros lugares',
				cta: {
					title: 'Hagamos tu app.',
					body: 'Diseño de apps, una construcción completa o una auditoría de producto. Cuéntame de la app.',
					button: 'Contacto'
				}
			}
}
