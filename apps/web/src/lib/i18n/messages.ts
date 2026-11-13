/**
 * Interface strings. English is the source of truth for the keys; the Spanish
 * dictionary must cover every one (checked by `satisfies` below).
 *
 * The Spanish is written for Peruvian readers, not translated word for word:
 * second person tú, celular / computadora, and industry terms (UX, design
 * system, prototipo) kept the way Peruvian designers actually say them. It is
 * a draft for the site owner to review and rewrite in their own voice.
 */
export const en = {
	'common.skip': 'Skip to content',
	'common.copy': 'Copy',
	'common.copied': 'Copied',

	'nav.primary': 'Primary',
	'nav.home': 'Home',
	'nav.work': 'Work',
	'nav.playground': 'Playground',
	'nav.skills': 'Skills',
	'nav.workWithMe': 'Work with me',
	'nav.contact': 'Contact',
	'nav.menuOpen': 'Open menu',
	'nav.menuClose': 'Close menu',
	'nav.themeToDark': 'Switch to dark theme',
	'nav.themeToLight': 'Switch to light theme',
	'nav.soundOn': 'Turn sound on',
	'nav.soundOff': 'Turn sound off',
	'nav.lang': 'Español',
	'nav.langLabel': 'Leer en español',

	'footer.email': 'Email',
	'footer.cv': 'CV',

	'project.close': 'Close case study',
	'project.next': 'Next case study',

	'work.label': 'Work',
	'work.title': 'Case studies',
	'work.lead':
		'Product design, research and prototyping. Each one covers the problem, the decisions I made and what I would do differently.',

	'playground.label': 'Playground',
	'playground.title': 'Things I make to learn',
	'playground.lead':
		'Small, self-contained experiments. They are not client work. Each one tests a single question about how an interface should feel. Press, drag and tap them.',
	'playground.testing': 'Testing',

	'skills.label': 'Skills',
	'skills.title': 'Design and engineering, in one pair of hands',
	'skills.lead':
		'What I work with, grouped by the kind of problem it solves. Each group links to work that shows it in use.',
	'skills.seeIn': 'See it in',

	'wwm.label': 'Work with me',
	'wwm.title': 'Have something to build?',
	'wwm.lead':
		'I take on a few kinds of work. If yours does not fit one of these, tell me about it anyway.',
	'wwm.cta': 'Start a conversation',

	'contact.label': 'Contact',
	'contact.title': 'Let’s talk',
	'contact.reach': 'Ways to reach me',
	'contact.experience': 'Experience',
	'contact.awards': 'Awards',
	'contact.cv': 'CV (PDF)',

	'agent.button': 'Agent',
	'agent.title': 'Use this site from your agent',
	'agent.body':
		'Everything here is readable by AI agents and scripts: no key, no signup. Paste one of these into your agent, or copy a ready-made prompt.',
	'agent.prompt': 'Copy a prompt',
	'agent.promptText':
		'Read {url}/llms.txt and tell me who Anthony Inga is, what he has built, and whether he would be a good fit for a design-engineering role at my company. Use the Markdown pages linked there if you need detail.',
	'agent.cmdIndex': 'Everything as plain text',
	'agent.cmdMarkdown': 'Any page as Markdown',
	'agent.cmdApi': 'Structured profile (JSON)',
	'agent.portal': 'Developer portal →',
	'agent.close': 'Close',

	'lang.suggest': 'Prefer to read this in Spanish?',
	'lang.yes': 'Sí, en español',
	'lang.no': 'No, thanks',

	'intro.title': 'Welcome',
	'intro.sr':
		'Anthony Inga, designer and developer. Type a command such as work, playground or contact, or press Enter to go to the site. Press Escape to skip.',
	'intro.designer': 'designer',
	'intro.developer': 'developer',
	'intro.awards': 'awards',
	'intro.status': 'status',
	'intro.ready': 'ready',
	'intro.developerText': 'Svelte · TypeScript · motion · prototypes',
	'intro.awardsText': 'W3 Visual & UX 2022 · W3 Best UX Practices 2021',
	'intro.statusText': 'open to design-engineering roles',
	'intro.readyText': 'type help, or press ⏎ to enter',
	'intro.windowTitle': 'anthony@inga — zsh',
	'intro.soundOff': 'sound off · best with sound on',
	'intro.soundOn': 'sound on',
	'intro.skip': 'skip intro',
	'intro.enter': 'enter ⏎',
	'intro.quick': 'Quick commands',
	'intro.input': 'Terminal command',
	'intro.notFound': 'command not found: {name}. try help',
	'intro.usageSound': 'usage: sound on | off',
	'intro.theme': 'theme: {mode}',
	'intro.soundSet': 'sound: {state}',
	'intro.help.work': 'case studies',
	'intro.help.playground': 'interface experiments',
	'intro.help.skills': 'what I design and build with',
	'intro.help.services': 'ways to work together',
	'intro.help.contact': 'say hello',
	'intro.help.agent': 'use this site from your agent',
	'intro.help.theme': 'toggle light / dark',
	'intro.help.sound': 'on | off',
	'intro.help.clear': 'clear the screen',
	'intro.help.enter': 'go to the site',

	'notFound.title': 'THIS PAGE IS NOT HERE.',
	'notFound.start': 'PRESS ANY KEY TO START',
	'notFound.startTouch': 'TAP ANYWHERE TO START'
} as const

export type MessageKey = keyof typeof en

export const es = {
	'common.skip': 'Saltar al contenido',
	'common.copy': 'Copiar',
	'common.copied': 'Copiado',

	'nav.primary': 'Principal',
	'nav.home': 'Inicio',
	'nav.work': 'Trabajo',
	'nav.playground': 'Playground',
	'nav.skills': 'Habilidades',
	'nav.workWithMe': 'Trabajemos',
	'nav.contact': 'Contacto',
	'nav.menuOpen': 'Abrir menú',
	'nav.menuClose': 'Cerrar menú',
	'nav.themeToDark': 'Cambiar a tema oscuro',
	'nav.themeToLight': 'Cambiar a tema claro',
	'nav.soundOn': 'Activar sonido',
	'nav.soundOff': 'Silenciar sonido',
	'nav.lang': 'English',
	'nav.langLabel': 'Read in English',

	'footer.email': 'Correo',
	'footer.cv': 'CV',

	'project.close': 'Cerrar caso de estudio',
	'project.next': 'Siguiente caso de estudio',

	'work.label': 'Trabajo',
	'work.title': 'Casos de estudio',
	'work.lead':
		'Diseño de producto, investigación y prototipado. En cada uno cuento el problema, las decisiones que tomé y qué haría distinto hoy.',

	'playground.label': 'Playground',
	'playground.title': 'Cosas que hago para aprender',
	'playground.lead':
		'Experimentos pequeños y autónomos, no son trabajo para clientes. Cada uno responde una sola pregunta sobre cómo debería sentirse una interfaz. Tócalos, arrástralos, juega con ellos.',
	'playground.testing': 'Pregunta',

	'skills.label': 'Habilidades',
	'skills.title': 'Diseño e ingeniería en las mismas manos',
	'skills.lead':
		'Con qué trabajo, agrupado por el tipo de problema que resuelve. Cada grupo te lleva a proyectos donde se ve en acción.',
	'skills.seeIn': 'Míralo en',

	'wwm.label': 'Trabajemos',
	'wwm.title': '¿Tienes algo por construir?',
	'wwm.lead':
		'Trabajo en unos cuantos tipos de proyecto. Si lo tuyo no encaja en ninguno, cuéntamelo igual.',
	'wwm.cta': 'Conversemos',

	'contact.label': 'Contacto',
	'contact.title': 'Hablemos',
	'contact.reach': 'Cómo contactarme',
	'contact.experience': 'Experiencia',
	'contact.awards': 'Premios',
	'contact.cv': 'CV (PDF)',

	'agent.button': 'Agente',
	'agent.title': 'Usa este sitio desde tu agente',
	'agent.body':
		'Todo lo que ves aquí lo pueden leer agentes de IA y scripts: sin key y sin registro. Pega uno de estos comandos en tu agente, o copia un prompt ya armado.',
	'agent.prompt': 'Copiar un prompt',
	'agent.promptText':
		'Lee {url}/es/llms.txt y cuéntame quién es Anthony Inga, qué ha construido y si encajaría en un rol de design engineering en mi empresa. Si necesitas detalle, usa las páginas en Markdown que se enlazan ahí.',
	'agent.cmdIndex': 'Todo en texto plano',
	'agent.cmdMarkdown': 'Cualquier página en Markdown',
	'agent.cmdApi': 'Perfil estructurado (JSON)',
	'agent.portal': 'Portal para desarrolladores →',
	'agent.close': 'Cerrar',

	'lang.suggest': '¿Prefieres leer esto en español?',
	'lang.yes': 'Sí, en español',
	'lang.no': 'No, gracias',

	'intro.title': 'Bienvenida',
	'intro.sr':
		'Anthony Inga, diseño y desarrollo. Escribe un comando como trabajo, playground o contacto, o presiona Enter para entrar al sitio. Presiona Escape para saltar.',
	'intro.designer': 'diseño',
	'intro.developer': 'desarrollo',
	'intro.awards': 'premios',
	'intro.status': 'estado',
	'intro.ready': 'listo',
	'intro.developerText': 'Svelte · TypeScript · motion · prototipos',
	'intro.awardsText': 'W3 Visual & UX 2022 · W3 Best UX Practices 2021',
	'intro.statusText': 'abierto a roles de design engineering',
	'intro.readyText': 'escribe ayuda, o presiona ⏎ para entrar',
	'intro.windowTitle': 'anthony@inga — zsh',
	'intro.soundOff': 'sin sonido · mejor con sonido',
	'intro.soundOn': 'sonido activado',
	'intro.skip': 'saltar intro',
	'intro.enter': 'entrar ⏎',
	'intro.quick': 'Comandos rápidos',
	'intro.input': 'Comando de la terminal',
	'intro.notFound': 'comando no encontrado: {name}. prueba con ayuda',
	'intro.usageSound': 'uso: sonido on | off',
	'intro.theme': 'tema: {mode}',
	'intro.soundSet': 'sonido: {state}',
	'intro.help.work': 'casos de estudio',
	'intro.help.playground': 'experimentos de interfaz',
	'intro.help.skills': 'con qué diseño y construyo',
	'intro.help.services': 'formas de trabajar juntos',
	'intro.help.contact': 'escríbeme',
	'intro.help.agent': 'usa este sitio desde tu agente',
	'intro.help.theme': 'cambiar claro / oscuro',
	'intro.help.sound': 'on | off',
	'intro.help.clear': 'limpiar la pantalla',
	'intro.help.enter': 'entrar al sitio',

	'notFound.title': 'ESTA PÁGINA NO EXISTE.',
	'notFound.start': 'PRESIONA CUALQUIER TECLA',
	'notFound.startTouch': 'TOCA LA PANTALLA PARA EMPEZAR'
} as const satisfies Record<MessageKey, string>
