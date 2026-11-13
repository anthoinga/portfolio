import type { UiDemoId } from './uiDemos'

export type PlaygroundNote = {
	id: UiDemoId
	note: string
	testing: string
	stack: string[]
}

/** Notes shown next to each experiment on /playground. */
export function playgroundNotes(lang: 'en' | 'es'): PlaygroundNote[] {
	const en = lang === 'en'
	return [
		{
			id: 'dither',
			note: en
				? 'A card that renders its image through a Bayer dither on a canvas and opens up when you press it.'
				: 'Una tarjeta que dibuja su imagen con un dither de Bayer en un canvas y se abre cuando la presionas.',
			testing: en
				? 'How much texture can an image lose before it stops feeling premium?'
				: '¿Cuánta textura puede perder una imagen antes de dejar de sentirse premium?',
			stack: ['Canvas 2D', 'Svelte 5']
		},
		{
			id: 'dock',
			note: en
				? 'A dock-style navigation with a resources submenu that grows out of the bar.'
				: 'Una navegación tipo dock con un submenú de recursos que crece desde la barra.',
			testing: en
				? 'Can a nav bar feel physical without getting in the way of the content behind it?'
				: '¿Puede una barra de navegación sentirse física sin estorbar el contenido que tiene detrás?',
			stack: ['CSS', 'Svelte 5']
		},
		{
			id: 'weather',
			note: en
				? 'A small forecast widget that expands in place to show the rest of the day.'
				: 'Un widget de clima que se expande en el mismo lugar para mostrar el resto del día.',
			testing: en
				? 'How little chrome does a glanceable widget need to still be tappable?'
				: '¿Cuánta interfaz necesita un widget que se lee de un vistazo para seguir siendo fácil de tocar?',
			stack: ['CSS', 'Svelte 5']
		},
		{
			id: 'tmb',
			note: en
				? 'A menu interaction recorded as a short loop. The live version is on this site.'
				: 'Una interacción de menú grabada como un loop corto. La versión en vivo está en este sitio.',
			testing: en
				? 'Whether motion alone can explain a menu without a single label.'
				: '¿Puede el movimiento solo explicar un menú, sin una sola etiqueta?',
			stack: ['Svelte 5', 'Video']
		}
	]
}
