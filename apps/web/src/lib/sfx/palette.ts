import { SCALE, gate, hit, play, sweep, tone } from './engine'

const r = (min: number, max: number) => min + Math.random() * (max - min)

/**
 * The site's sounds. Short, dry, and quantised to a pentatonic scale, in the
 * spirit of pocket synths: a typed key is a tick, a tap is a tiny three-partial
 * chirp, arriving at the end of a page is a soft thud.
 */
export const sfx = {
	/** Each typed character in the terminal. */
	key() {
		if (!gate('key')) return
		play((c, t, env) => {
			hit('bandpass', r(2600, 4200), 1.4, env(c, r(0.22, 0.32), 0.002, 0.03, t), t, 0.04)
			tone('sine', r(150, 190), env(c, 0.12, 0.002, 0.025, t), t, 0.03)
		})
	},

	/** Enter in the terminal. */
	enter() {
		if (!gate('enter')) return
		play((c, t, env) => {
			hit('lowpass', 1400, 0.8, env(c, 0.32, 0.003, 0.07, t), t, 0.09)
			tone('sine', 120, env(c, 0.28, 0.003, 0.08, t), t, 0.1, 70)
		})
	},

	/** One rising note per boot line. */
	tick(i: number) {
		if (!gate('tick')) return
		play((c, t, env) => {
			tone('triangle', SCALE[i % SCALE.length], env(c, 0.09, 0.004, 0.09, t), t, 0.12)
		})
	},

	/** Boot finished, or sound switched on. */
	ready() {
		play((c, t, env) => {
			;[1318.51, 1567.98, 2093, 2637].forEach((hz, k) => {
				const at = t + k * 0.045
				tone('sine', hz, env(c, 0.07, 0.003, 0.18, at), at, 0.2)
			})
		})
	},

	/** Opening something big (intro exit, case study open). */
	whooshUp() {
		if (!gate('whoosh')) return
		sweep(0.35, true)
	},

	/** Closing it again. */
	whooshDown() {
		if (!gate('whoosh')) return
		sweep(0.35, false)
	},

	/** Hover over a piece of chrome. Callers pass fine-pointer devices only. */
	hover() {
		if (!gate('hover', 120)) return
		play((c, t, env) => {
			tone('sine', 1760, env(c, 0.05, 0.002, 0.05, t), t, 0.06, 2200)
			hit('bandpass', 4200, 1.2, env(c, 0.04, 0.001, 0.012, t), t, 0.015)
		})
	},

	/** A press on any button or nav item. */
	click() {
		if (!gate('click')) return
		play((c, t, env) => {
			;([
				[2860, 0.07, 0.22],
				[4150, 0.045, 0.14],
				[6240, 0.025, 0.08]
			] as const).forEach(([hz, peak, decay]) =>
				tone('sine', hz, env(c, peak, 0.001, decay, t), t, decay + 0.02)
			)
			hit('highpass', 5000, 0.7, env(c, 0.05, 0.001, 0.015, t), t, 0.02)
		})
	},

	/** Toggles and panels. `pitch` below 1 is the "going dark" version. */
	pop(pitch = 1) {
		if (!gate('pop')) return
		play((c, t, env) => {
			tone('sine', 640 * pitch, env(c, 0.26, 0.004, 0.12, t), t, 0.14, 190 * pitch)
			hit('highpass', 3000, 0.7, env(c, 0.05, 0.002, 0.03, t), t, 0.04)
		})
	},

	/** Something worked: email copied, command accepted. */
	confirm() {
		if (!gate('confirm')) return
		play((c, t, env) => {
			const root = SCALE[2]
			tone('sine', root, env(c, 0.11, 0.004, 0.08, t), t, 0.1)
			const at = t + 0.06
			tone('sine', root * 1.5, env(c, 0.09, 0.004, 0.12, at), at, 0.14)
		})
	},

	/** Unknown command, or a 404. */
	nope() {
		if (!gate('nope')) return
		play((c, t, env) => {
			tone('sine', 320, env(c, 0.26, 0.004, 0.12, t), t, 0.14, 120)
			hit('highpass', 3000, 0.7, env(c, 0.05, 0.002, 0.03, t), t, 0.04)
		})
	},

	/** Reached the very bottom of a page. */
	thud() {
		if (!gate('thud')) return
		play((c, t, env) => {
			hit('lowpass', 900, 0.8, env(c, 0.35, 0.003, 0.07, t), t, 0.09)
			tone('sine', 90, env(c, 0.35, 0.003, 0.12, t), t, 0.16, 50)
		})
	},

	/** Overscroll pull, `p` from 0 to 1. Pitch climbs the scale as you pull. */
	pull(p: number) {
		if (!gate('pull', 80)) return
		const hz = SCALE[0] + (SCALE[4] - SCALE[0]) * Math.min(1, Math.max(0, p))
		play((c, t, env) => {
			tone('sine', hz, env(c, 0.05, 0.004, 0.05, t), t, 0.06)
		})
	}
}

export type SfxName = keyof typeof sfx
