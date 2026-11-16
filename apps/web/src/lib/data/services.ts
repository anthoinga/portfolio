/**
 * What is on offer, how an engagement starts, and the working terms. Written for agencies and
 * studios that bring in an independent design engineer. The lead offer comes first.
 *
 * The terms here are plain-language statements of intent, not contract text. The signed
 * agreement and statement of work are what bind either side, and they follow the reviewed templates.
 */
type Lang = 'en' | 'es'

export type Service = {
	id: string
	title: string
	summary: string
	/** Billing shape, e.g. fixed scope or a weekly capacity block. */
	shape: string
	/** Typical length. */
	length: string
	forWhom: string
	deliverables: string[]
	/** Case study that shows this kind of work. */
	proof: { slug: string; label: string }
}

export type Step = { title: string; body: string }
export type Term = { title: string; body: string }
export type Faq = { q: string; a: string }

export function services(lang: Lang): Service[] {
	const en = lang === 'en'
	return [
		{
			id: 'prototype',
			title: en ? 'Prototype sprint' : 'Sprint de prototipo',
			summary: en
				? 'A working, interactive prototype of one idea, built in code so your client can try it before anyone commits to building it.'
				: 'Un prototipo interactivo de una idea, hecho en código, para que tu cliente lo pruebe antes de que alguien se comprometa a construirlo.',
			shape: en ? 'Fixed scope' : 'Alcance fijo',
			length: en ? '2–3 weeks' : '2–3 semanas',
			forWhom: en
				? 'A pitch, a risky feature, or a flow your client needs to see behave before they approve it.'
				: 'Una propuesta, una función riesgosa o un flujo que tu cliente necesita ver funcionando antes de aprobarlo.',
			deliverables: en
				? ['A prototype that behaves like the real thing', 'Notes from testing it with real people', 'A recommendation on what to build next']
				: ['Un prototipo que se comporta como lo real', 'Notas de probarlo con personas reales', 'Una recomendación sobre qué construir después'],
			proof: { slug: 'convenience', label: 'Conversational Convenience' }
		},
		{
			id: 'overflow',
			title: en ? 'Overflow design engineering' : 'Design engineering de refuerzo',
			summary: en
				? 'A block of weekly capacity, working alongside your team on interface work in code, against deliverables we agree up front.'
				: 'Un bloque de capacidad semanal, trabajando junto a tu equipo en interfaces en código, sobre entregables que acordamos de antemano.',
			shape: en ? 'Weekly capacity block, one month minimum' : 'Bloque semanal, mínimo un mes',
			length: en ? 'From 1 month' : 'Desde 1 mes',
			forWhom: en
				? 'A busy stretch, a build your team lacks the front-end hands for, or work that needs design and engineering in one person.'
				: 'Una racha de mucho trabajo, un desarrollo para el que tu equipo no tiene manos de front-end, o trabajo que necesita diseño e ingeniería en una sola persona.',
			deliverables: en
				? ['Production-ready UI in your stack', 'Component and token work', 'Specs and handoff your engineers can use']
				: ['UI lista para producción en tu stack', 'Trabajo en componentes y tokens', 'Specs y handoff que tus ingenieros puedan usar'],
			proof: { slug: 'talent', label: 'Talent Marketplace' }
		},
		{
			id: 'system',
			title: en ? 'Design system foundations' : 'Bases de un design system',
			summary: en
				? 'The starting set of tokens, components and rules that lets a product team, or several of your clients, keep building without starting over.'
				: 'El conjunto inicial de tokens, componentes y reglas que permite a un equipo de producto, o a varios de tus clientes, seguir construyendo sin empezar de cero.',
			shape: en ? 'Fixed scope' : 'Alcance fijo',
			length: en ? '4–6 weeks' : '4–6 semanas',
			forWhom: en
				? 'A client with several products or a growing team, or an agency that wants a reusable base, including white-label.'
				: 'Un cliente con varios productos o un equipo en crecimiento, o una agencia que quiere una base reutilizable, incluso white-label.',
			deliverables: en
				? ['Tokens and core components, in Figma and in code', 'Usage documentation', 'A plan for adoption']
				: ['Tokens y componentes base, en Figma y en código', 'Documentación de uso', 'Un plan de adopción'],
			proof: { slug: 'insurance', label: 'Insurance Aggregator' }
		},
		{
			id: 'audit',
			title: en ? 'UX audit and research' : 'Auditoría UX e investigación',
			summary: en
				? 'Find where an existing experience breaks down and what to fix first, with evidence you can hand to your client.'
				: 'Encontrar dónde se rompe una experiencia existente y qué arreglar primero, con evidencia que puedes entregar a tu cliente.',
			shape: en ? 'Fixed scope' : 'Alcance fijo',
			length: en ? '1–2 weeks' : '1–2 semanas',
			forWhom: en
				? 'A redesign that needs a starting point, or a product losing people somewhere and nobody knows where.'
				: 'Un rediseño que necesita un punto de partida, o un producto que pierde gente en algún lugar y nadie sabe dónde.',
			deliverables: en
				? ['Research and heuristic review', 'Prioritised findings', 'Concrete next steps']
				: ['Investigación y revisión heurística', 'Hallazgos priorizados', 'Siguientes pasos concretos'],
			proof: { slug: 'curbside', label: 'Curbside Pickup' }
		}
	]
}

/** How an engagement starts, in order. */
export function process(lang: Lang): Step[] {
	const en = lang === 'en'
	return [
		{
			title: en ? 'Send an enquiry' : 'Envía una consulta',
			body: en
				? 'Tell me what you need, the timeline and how you would like to work. I reply within two working days.'
				: 'Cuéntame qué necesitas, el plazo y cómo te gustaría trabajar. Respondo en dos días hábiles.'
		},
		{
			title: en ? 'Scoping call' : 'Llamada de alcance',
			body: en
				? 'A 30-minute call to understand the work and your client. If you need an NDA first, I can sign yours or send mine before we talk.'
				: 'Una llamada de 30 minutos para entender el trabajo y a tu cliente. Si necesitas un NDA antes, puedo firmar el tuyo o enviarte el mío antes de hablar.'
		},
		{
			title: en ? 'Written proposal' : 'Propuesta escrita',
			body: en
				? 'A short statement of work: scope, deliverables, timeline, fee and what I need from you.'
				: 'Un statement of work breve: alcance, entregables, plazo, tarifa y lo que necesito de tu parte.'
		},
		{
			title: en ? 'Agreement, deposit, kickoff' : 'Acuerdo, anticipo e inicio',
			body: en
				? 'We sign the agreement and the statement of work, the deposit books the dates, and we start.'
				: 'Firmamos el acuerdo y el statement of work, el anticipo reserva las fechas y empezamos.'
		}
	]
}

/** How the work is run, in plain language. */
export function terms(lang: Lang): Term[] {
	const en = lang === 'en'
	return [
		{
			title: en ? 'White-label by default' : 'White-label por defecto',
			body: en
				? 'I work under your brand and in your process. I do not name your clients or show the work publicly without your written permission.'
				: 'Trabajo bajo tu marca y dentro de tu proceso. No nombro a tus clientes ni muestro el trabajo públicamente sin tu permiso por escrito.'
		},
		{
			title: en ? 'Independent contractor' : 'Contratista independiente',
			body: en
				? 'I run my own business, set my own hours and methods, use my own tools, and take on other clients. We agree deliverables, not a staff seat.'
				: 'Tengo mi propio negocio, defino mis horarios y métodos, uso mis propias herramientas y trabajo con otros clientes. Acordamos entregables, no un puesto de planilla.'
		},
		{
			title: en ? 'In writing before work starts' : 'Por escrito antes de empezar',
			body: en
				? 'Every project has a signed agreement and statement of work. Changes to scope go through a short written change order.'
				: 'Cada proyecto tiene un acuerdo y un statement of work firmados. Los cambios de alcance pasan por una orden de cambio breve y por escrito.'
		},
		{
			title: en ? 'Payment' : 'Pago',
			body: en
				? 'A deposit books the dates. Fixed projects are billed by milestone and capacity blocks monthly in advance. Invoices are due within 30 days.'
				: 'Un anticipo reserva las fechas. Los proyectos fijos se facturan por hitos y los bloques de capacidad por mes adelantado. Las facturas vencen a los 30 días.'
		},
		{
			title: en ? 'Ownership' : 'Propiedad',
			body: en
				? 'The work is yours once the final invoice is paid. I keep the right to reuse my general tools and know-how.'
				: 'El trabajo es tuyo cuando se paga la factura final. Conservo el derecho de reutilizar mis herramientas y conocimiento generales.'
		},
		{
			title: en ? 'Where and when' : 'Dónde y cuándo',
			body: en
				? 'Based in Texas, working in US Central time with overlap for other US time zones. Remote by default.'
				: 'Con base en Texas, trabajando en horario central de EE. UU., con cruce para otras zonas horarias de EE. UU. Remoto por defecto.'
		},
		{
			title: en ? 'Tools and stack' : 'Herramientas y stack',
			body: en
				? 'Figma for design, and Svelte, TypeScript and Tailwind for front-end builds. I also work in your existing codebase and component library.'
				: 'Figma para diseño, y Svelte, TypeScript y Tailwind para front-end. También trabajo dentro de tu código y librería de componentes existentes.'
		}
	]
}

export function faq(lang: Lang): Faq[] {
	const en = lang === 'en'
	return [
		{
			q: en ? 'Will you sign our NDA?' : '¿Firmas nuestro NDA?',
			a: en
				? 'Yes, usually. I can sign yours, or send a mutual NDA, before the scoping call.'
				: 'Sí, normalmente. Puedo firmar el tuyo, o enviarte un NDA mutuo, antes de la llamada de alcance.'
		},
		{
			q: en ? 'Can you work under our brand?' : '¿Puedes trabajar bajo nuestra marca?',
			a: en
				? 'That is the default. Your client never needs to know I exist, and I will not list them or the work without written permission.'
				: 'Es lo normal. Tu cliente no necesita saber que existo, y no lo menciono ni muestro el trabajo sin permiso por escrito.'
		},
		{
			q: en ? 'What if the scope changes?' : '¿Qué pasa si cambia el alcance?',
			a: en
				? 'We write it down in a short change order that says what changes and what it does to time and fee, and both sign before I start on it.'
				: 'Lo ponemos por escrito en una orden de cambio breve que dice qué cambia y cómo afecta el plazo y la tarifa, y ambos firmamos antes de que empiece.'
		},
		{
			q: en ? 'Who owns the code and the design?' : '¿Quién es dueño del código y del diseño?',
			a: en
				? 'You do, once the final invoice is paid. I keep the right to reuse my general tools and know-how.'
				: 'Tú, una vez pagada la factura final. Conservo el derecho de reutilizar mis herramientas y conocimiento generales.'
		},
		{
			q: en ? 'How do you invoice?' : '¿Cómo facturas?',
			a: en
				? 'By email, in US dollars, with a deposit up front. Invoices are due within 30 days. I can complete your vendor onboarding and tax forms.'
				: 'Por correo, en dólares estadounidenses, con un anticipo al inicio. Las facturas vencen a los 30 días. Puedo completar tu alta de proveedor y formularios de impuestos.'
		},
		{
			q: en ? 'How soon can you start?' : '¿Qué tan pronto puedes empezar?',
			a: en
				? 'It depends on my calendar, which the line at the top of the home page keeps current. Send an enquiry with your dates and I will tell you what is possible.'
				: 'Depende de mi calendario, que la línea al inicio de la página principal mantiene al día. Envía una consulta con tus fechas y te digo qué es posible.'
		}
	]
}
