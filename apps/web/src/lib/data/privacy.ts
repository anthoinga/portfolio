export type PrivacyCopy = {
	title: string
	lead: string
	sections: { title: string; body: string }[]
}

/** Plain-language privacy notice, in both languages. The Spanish is a draft for review. */
export function privacyCopy(lang: 'en' | 'es', analyticsOn: boolean, formOn = false): PrivacyCopy {
	const en = lang === 'en'
	return {
		title: en ? 'Privacy' : 'Privacidad',
		lead: en
			? 'This site collects as little as possible. There are no ads, no trackers and no cookies.'
			: 'Este sitio recoge lo mínimo posible. No hay anuncios, ni rastreadores, ni cookies.',
		sections: [
			{
				title: en ? 'What is stored on your device' : 'Qué se guarda en tu dispositivo',
				body: en
					? 'Your choices (light or dark theme, sound on or off, and language) are kept in your browser’s local storage so the site remembers them. They never leave your device. Whether you have seen the intro is kept for the length of your visit only.'
					: 'Tus preferencias (tema claro u oscuro, sonido y idioma) se guardan en el almacenamiento local de tu navegador para que el sitio las recuerde. Nunca salen de tu dispositivo. Haber visto la intro se recuerda solo mientras dura tu visita.'
			},
			{
				title: en ? 'Analytics' : 'Analítica',
				body: analyticsOn
					? en
						? 'The site counts page views with Vercel Web Analytics. It does not use cookies, does not follow you across other sites, and does not build a profile of you.'
						: 'El sitio cuenta las visitas con Vercel Web Analytics. No usa cookies, no te sigue por otros sitios y no arma un perfil sobre ti.'
					: en
						? 'There is no analytics on this site.'
						: 'Este sitio no tiene analítica.'
			},
			{
				title: en ? 'Enquiries and email' : 'Consultas y correo',
				body: en
					? `${
							formOn
								? 'If you send an enquiry through the form, your name, company, email address and message pass through a form service that delivers them to my inbox. '
								: 'The enquiry form does not send anything from this site; it only copies my email address so you can write to me. '
						}If you write to me, I keep your details only to reply and, if we work together, to run the project. I do not add you to any list, sell your details or share them except with the service that delivers the message. You can ask me by email to delete them at any time.`
					: `${
							formOn
								? 'Si envías una consulta por el formulario, tu nombre, empresa, correo y mensaje pasan por un servicio de formularios que los entrega a mi bandeja. '
								: 'El formulario de consulta no envía nada desde este sitio; solo copia mi correo para que me escribas. '
						}Si me escribes, guardo tus datos solo para responderte y, si trabajamos juntos, para llevar el proyecto. No te agrego a ninguna lista, no vendo tus datos ni los comparto, salvo con el servicio que entrega el mensaje. Puedes pedirme por correo que los elimine en cualquier momento.`
			},
			{
				title: en ? 'AI agents' : 'Agentes de IA',
				body: en
					? 'This site is intentionally readable by AI agents and crawlers: see /llms.txt and /developers. Everything they can read is already public on these pages.'
					: 'Este sitio está pensado para que lo lean agentes de IA y crawlers: mira /llms.txt y /developers. Todo lo que pueden leer ya es público en estas páginas.'
			}
		]
	}
}
