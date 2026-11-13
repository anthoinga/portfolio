/**
 * Tiny Web Audio synth. Everything is generated: a shared white-noise buffer run
 * through filters, plus sine/triangle oscillators with exponential envelopes.
 * No audio files. Nothing is created until the visitor turns sound on, and the
 * context itself is only created from a user gesture.
 */
import { sound } from './sound.svelte'

/** C-major pentatonic, C5 up to E6. Every melodic sound is quantised to this. */
export const SCALE = [523.25, 587.33, 659.25, 783.99, 880, 1046.5, 1174.66, 1318.51]

const MASTER_GAIN = 0.5
const FLOOR = 1e-4

let ctx: AudioContext | null = null
let master: GainNode | null = null
let noise: AudioBuffer | null = null
let lastAny = 0
const lastByKind = new Map<string, number>()

type AudioSessionNav = Navigator & { audioSession?: { type: string } }

function create(): AudioContext | null {
	if (ctx) return ctx
	if (typeof window === 'undefined') return null
	const Ctor =
		window.AudioContext ??
		(window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
	if (!Ctor) return null
	try {
		// iOS: play through the media channel so the silent switch does not mute it.
		const session = (navigator as AudioSessionNav).audioSession
		if (session && session.type !== 'playback') session.type = 'playback'
	} catch {
		/* not supported */
	}
	ctx = new Ctor()
	master = ctx.createGain()
	master.gain.value = MASTER_GAIN
	master.connect(ctx.destination)
	noise = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate)
	const data = noise.getChannelData(0)
	for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1
	return ctx
}

/**
 * Call from a user gesture (click, key). Safe to call repeatedly. Resolves once
 * the context is running, so callers can play a sound straight after.
 */
export function unlockAudio(): Promise<void> {
	if (!sound.on) return Promise.resolve()
	const c = create()
	if (!c || c.state === 'running') return Promise.resolve()
	return c.resume().catch(() => {})
}

/** The running context, or null when sound is off, hidden, or not yet unlocked. */
function live(): AudioContext | null {
	if (!sound.on || !ctx || ctx.state !== 'running') return null
	if (typeof document !== 'undefined' && document.hidden) return null
	return ctx
}

/** Rate limit: one sound per 40 ms overall, and `ms` per kind. */
export function gate(kind: string, ms = 0): boolean {
	const now = performance.now()
	if (now - lastAny < 40) return false
	if (ms && now - (lastByKind.get(kind) ?? -Infinity) < ms) return false
	lastAny = now
	lastByKind.set(kind, now)
	return true
}

/** Envelope into the master bus: rise to `peak` over `attack`, then fall over `release`. */
function env(c: AudioContext, peak: number, attack: number, release: number, at: number) {
	const g = c.createGain()
	g.gain.setValueAtTime(FLOOR, at)
	g.gain.exponentialRampToValueAtTime(Math.max(peak, FLOOR * 2), at + attack)
	g.gain.exponentialRampToValueAtTime(FLOOR, at + attack + release)
	g.connect(master!)
	return g
}

export function tone(
	type: OscillatorType,
	hz: number,
	out: AudioNode,
	at: number,
	dur: number,
	glideTo?: number
) {
	const c = ctx!
	const o = c.createOscillator()
	o.type = type
	o.frequency.setValueAtTime(hz, at)
	if (glideTo) o.frequency.exponentialRampToValueAtTime(glideTo, at + dur)
	o.connect(out)
	o.start(at)
	o.stop(at + dur + 0.02)
}

export function hit(
	filter: BiquadFilterType,
	hz: number,
	q: number,
	out: AudioNode,
	at: number,
	dur: number
) {
	const c = ctx!
	const src = c.createBufferSource()
	src.buffer = noise
	// Slight random pitch so repeated hits do not sound machine-gunned.
	src.playbackRate.value = 0.8 + Math.random() * 0.4
	const f = c.createBiquadFilter()
	f.type = filter
	f.frequency.value = hz
	f.Q.value = q
	src.connect(f).connect(out)
	src.start(at, Math.random() * 0.5, dur)
}

/** Runs `fn` with the live context and its start time, or does nothing. */
export function play(fn: (c: AudioContext, t: number, out: typeof env) => void) {
	const c = live()
	if (!c) return
	fn(c, c.currentTime, env)
}

/** Long sweep of band-passed noise, used for transitions. `up` rises then settles. */
export function sweep(seconds: number, up: boolean) {
	play((c, t) => {
		const g = c.createGain()
		g.gain.setValueAtTime(FLOOR, t)
		g.gain.exponentialRampToValueAtTime(0.14, t + seconds * 0.5)
		g.gain.exponentialRampToValueAtTime(FLOOR, t + seconds)
		g.connect(master!)
		const src = c.createBufferSource()
		src.buffer = noise
		src.loop = true
		const f = c.createBiquadFilter()
		f.type = 'bandpass'
		f.Q.value = 1.2
		const [from, peak, end] = up ? [320, 2600, 900] : [900, 2600, 320]
		f.frequency.setValueAtTime(from, t)
		f.frequency.exponentialRampToValueAtTime(peak, t + seconds * 0.6)
		f.frequency.exponentialRampToValueAtTime(end, t + seconds)
		src.connect(f).connect(g)
		src.start(t)
		src.stop(t + seconds + 0.05)
	})
}

/** Quiet two-oscillator drone under the intro. Returns a function that fades it out. */
export function startDrone(): () => void {
	const c = live()
	if (!c) return () => {}
	const t = c.currentTime
	const g = c.createGain()
	g.gain.setValueAtTime(FLOOR, t)
	g.gain.exponentialRampToValueAtTime(0.05, t + 1.5)
	g.connect(master!)
	const low = c.createBiquadFilter()
	low.type = 'lowpass'
	low.frequency.value = 300
	low.connect(g)
	const oscs = [130.81, 131.2].map((hz) => {
		const o = c.createOscillator()
		o.type = 'sine'
		o.frequency.value = hz
		o.connect(low)
		o.start(t)
		return o
	})
	const air = c.createBufferSource()
	air.buffer = noise
	air.loop = true
	const airGain = c.createGain()
	airGain.gain.value = 0.03
	air.connect(airGain).connect(low)
	air.start(t)
	let stopped = false
	return () => {
		if (stopped) return
		stopped = true
		const n = c.currentTime
		g.gain.cancelScheduledValues(n)
		g.gain.setValueAtTime(Math.max(g.gain.value, FLOOR), n)
		g.gain.exponentialRampToValueAtTime(FLOOR, n + 0.8)
		for (const o of oscs) o.stop(n + 0.85)
		air.stop(n + 0.85)
	}
}
