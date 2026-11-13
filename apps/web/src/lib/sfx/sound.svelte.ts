/** User-facing sound preference. Default is off; it persists per browser. */
const KEY = 'sound'

function read(): boolean {
	try {
		return localStorage.getItem(KEY) === '1'
	} catch {
		return false
	}
}

export const sound = $state({ on: false, ready: false })

/** Call once on mount (client only) to pick up the saved preference. */
export function loadSoundPreference() {
	sound.on = read()
	sound.ready = true
}

export function setSound(on: boolean) {
	sound.on = on
	try {
		localStorage.setItem(KEY, on ? '1' : '0')
	} catch {
		/* storage blocked: preference lasts for this page view only */
	}
}
