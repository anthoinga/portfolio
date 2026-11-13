<script lang="ts">
	import { goto } from '$app/navigation'
	import { onMount, tick } from 'svelte'
	import { currentLang, href, t, type Lang } from '$lib/i18n'
	import { finishIntro } from '$lib/intro.svelte'
	import { startDrone, unlockAudio } from '$lib/sfx/engine'
	import { sfx } from '$lib/sfx/palette'
	import { setSound, sound } from '$lib/sfx/sound.svelte'
	import { toggleTheme } from '$lib/theme.svelte'

	let { onclose }: { onclose: () => void } = $props()

	type Line = { kind: 'cmd' | 'ok' | 'ready' | 'out' | 'err' | 'blank'; label?: string; text: string }

	const lang: Lang = currentLang()
	const PROMPT = 'anthony@inga ~ %'
	const COMMAND = 'npx inga'

	const BOOT: Line[] = [
		{ kind: 'ok', label: t('intro.designer'), text: 'Persimmony · 7-Eleven R&D · Bottle Rocket' },
		{ kind: 'ok', label: t('intro.developer'), text: t('intro.developerText') },
		{ kind: 'ok', label: t('intro.awards'), text: t('intro.awardsText') },
		{ kind: 'ok', label: t('intro.status'), text: t('intro.statusText') },
		{ kind: 'ready', label: t('intro.ready'), text: t('intro.readyText') }
	]

	/** Every command in both languages, so `work` and `trabajo` both run. */
	const COMMANDS = [
		{ id: 'work', en: 'work', es: 'trabajo', to: '/work' },
		{ id: 'playground', en: 'playground', es: 'playground', to: '/playground' },
		{ id: 'skills', en: 'skills', es: 'habilidades', to: '/skills' },
		{ id: 'services', en: 'services', es: 'servicios', to: '/work-with-me' },
		{ id: 'contact', en: 'contact', es: 'contacto', to: '/contact' },
		{ id: 'theme', en: 'theme', es: 'tema' },
		{ id: 'sound', en: 'sound', es: 'sonido' },
		{ id: 'clear', en: 'clear', es: 'limpiar' },
		{ id: 'enter', en: 'enter', es: 'entrar' },
		{ id: 'help', en: 'help', es: 'ayuda' }
	] as const
	type CommandId = (typeof COMMANDS)[number]['id']

	const HELP_IDS: CommandId[] = ['work', 'playground', 'skills', 'services', 'contact', 'theme', 'sound', 'clear', 'enter']
	const nameOf = (id: CommandId) => COMMANDS.find((c) => c.id === id)![lang]
	const resolve = (word: string) =>
		COMMANDS.find((c) => c.en === word || c.es === word) ??
		(word === 'exit' || word === 'salir' ? COMMANDS.find((c) => c.id === 'enter') : undefined)
	const NAMES = COMMANDS.flatMap((c) => [c.en, c.es])
	const QUICK: CommandId[] = ['work', 'playground', 'skills', 'contact']
	const modeWord = (mode: string) =>
		lang === 'es' ? (mode === 'dark' ? 'oscuro' : 'claro') : mode

	let lines = $state<Line[]>([])
	let typed = $state('')
	let phase = $state<'boot' | 'prompt'>('boot')
	let closing = $state(false)
	let value = $state('')
	let input: HTMLInputElement | undefined = $state()
	let body: HTMLElement | undefined = $state()
	let dialog: HTMLElement | undefined = $state()
	let fast = false
	let alive = true
	let stopDrone: (() => void) | null = null
	const history: string[] = []
	let historyAt = -1

	const sleep = (ms: number) =>
		new Promise<void>((resolve) => {
			if (fast) return resolve()
			setTimeout(resolve, ms)
		})

	function push(line: Line) {
		lines.push(line)
		void tick().then(() => body?.scrollTo({ top: body.scrollHeight }))
	}

	async function boot() {
		await sleep(350)
		for (const ch of COMMAND) {
			if (!alive) return
			typed += ch
			sfx.key()
			await sleep(fast ? 0 : 45 + Math.random() * 40)
		}
		await sleep(220)
		if (!alive) return
		sfx.enter()
		push({ kind: 'cmd', text: `${PROMPT} ${COMMAND}` })
		typed = ''
		await sleep(260)
		for (const [i, line] of BOOT.entries()) {
			if (!alive) return
			push(line)
			sfx.tick(i)
			await sleep(260)
		}
		if (!alive) return
		sfx.ready()
		phase = 'prompt'
		await tick()
		input?.focus()
	}

	async function leave(to?: string) {
		if (closing) return
		closing = true
		alive = false
		stopDrone?.()
		sfx.whooshUp()
		finishIntro()
		if (to) void goto(to)
		await new Promise((r) => setTimeout(r, 520))
		onclose()
	}

	function say(text: string, kind: Line['kind'] = 'out') {
		push({ kind, text })
	}

	function run(raw: string) {
		const cmd = raw.trim().toLowerCase()
		push({ kind: 'cmd', text: `${PROMPT} ${raw}` })
		if (!cmd) {
			sfx.enter()
			return void leave()
		}
		history.unshift(raw)
		historyAt = -1
		const [word, arg] = cmd.split(/\s+/)
		const command = resolve(word)
		if (!command) {
			sfx.nope()
			return say(t('intro.notFound', { name: word }), 'err')
		}
		if ('to' in command) {
			sfx.confirm()
			const target = href(command.to, lang)
			say(`→ ${target}`)
			setTimeout(() => void leave(target), 380)
		} else if (command.id === 'help') {
			sfx.confirm()
			push({ kind: 'blank', text: '' })
			for (const id of HELP_IDS) {
				push({ kind: 'out', label: nameOf(id), text: t(`intro.help.${id}` as const) })
			}
			push({ kind: 'blank', text: '' })
		} else if (command.id === 'enter') {
			sfx.enter()
			void leave()
		} else if (command.id === 'clear') {
			sfx.click()
			lines = []
		} else if (command.id === 'theme') {
			const next = toggleTheme()
			sfx.pop(next === 'dark' ? 0.75 : 1)
			say(t('intro.theme', { mode: modeWord(next) }))
		} else if (command.id === 'sound') {
			if (arg === 'off') {
				sfx.pop(0.75)
				setSound(false)
				say(t('intro.soundSet', { state: 'off' }))
			} else if (arg === 'on' || !arg) {
				void turnSoundOn()
				say(t('intro.soundSet', { state: 'on' }))
			} else {
				sfx.nope()
				say(t('intro.usageSound'), 'err')
			}
		}
	}

	async function turnSoundOn() {
		setSound(true)
		await unlockAudio()
		sfx.ready()
		stopDrone ??= startDrone()
	}

	async function toggleSound() {
		if (sound.on) {
			sfx.pop(0.75)
			stopDrone?.()
			stopDrone = null
			setSound(false)
		} else {
			await turnSoundOn()
		}
		input?.focus()
	}

	function onKey(e: KeyboardEvent) {
		if (e.key.length === 1 && !e.metaKey && !e.ctrlKey) sfx.key()
		if (e.key === 'Enter') {
			sfx.enter()
			const v = value
			value = ''
			run(v)
		} else if (e.key === 'ArrowUp') {
			e.preventDefault()
			if (historyAt < history.length - 1) value = history[++historyAt]
		} else if (e.key === 'ArrowDown') {
			e.preventDefault()
			historyAt = Math.max(-1, historyAt - 1)
			value = historyAt === -1 ? '' : history[historyAt]
		} else if (e.key === 'Tab') {
			const hit = value ? NAMES.find((n) => n.startsWith(value.toLowerCase())) : null
			if (hit) {
				e.preventDefault()
				value = hit
			}
		}
	}

	function onWindowKey(e: KeyboardEvent) {
		if (e.key === 'Escape') return void leave()
		if (e.key === 'Enter' && phase === 'boot') fast = true
		if (e.key === 'Tab' && dialog) {
			const items = [...dialog.querySelectorAll<HTMLElement>('button, input, a[href]')].filter(
				(el) => !el.hasAttribute('disabled')
			)
			if (!items.length) return
			const first = items[0]
			const last = items[items.length - 1]
			if (e.shiftKey && document.activeElement === first) {
				e.preventDefault()
				last.focus()
			} else if (!e.shiftKey && document.activeElement === last) {
				e.preventDefault()
				first.focus()
			}
		}
	}

	onMount(() => {
		if (sound.on) void unlockAudio().then(() => (stopDrone ??= startDrone()))
		void boot()
		return () => {
			alive = false
			stopDrone?.()
		}
	})
</script>

<svelte:window onkeydown={onWindowKey} />

<div
	class="intro"
	class:closing
	role="dialog"
	aria-modal="true"
	aria-label={t('intro.title')}
	bind:this={dialog}
>
	<p class="sr-only">{t('intro.sr')}</p>

	<div class="window" role="presentation" onclick={() => input?.focus()}>
		<div class="bar" aria-hidden="true">
			<span></span><span></span><span></span>
			<i>{t('intro.windowTitle')}</i>
		</div>

		<div class="body" bind:this={body}>
			{#each lines as line, i (i)}
				{#if line.kind === 'blank'}
					<div class="row">&nbsp;</div>
				{:else if line.kind === 'cmd'}
					<div class="row cmd">{line.text}</div>
				{:else if line.kind === 'ok' || line.kind === 'ready'}
					<div class="row">
						<b class:go={line.kind === 'ready'}>{line.kind === 'ok' ? '✔' : '➜'}</b>
						<span class="label">{line.label}</span>
						<span>{line.text}</span>
					</div>
				{:else if line.kind === 'err'}
					<div class="row err">{line.text}</div>
				{:else}
					<div class="row">
						{#if line.label}<span class="label pad">{line.label}</span>{/if}
						<span>{line.text}</span>
					</div>
				{/if}
			{/each}

			{#if phase === 'boot'}
				<div class="row cmd">{PROMPT} {typed}<span class="caret"></span></div>
			{:else}
				<label class="row cmd prompt">
					<span>{PROMPT}</span>
					<input
						bind:this={input}
						bind:value
						onkeydown={onKey}
						type="text"
						inputmode="text"
						enterkeyhint="go"
						autocomplete="off"
						autocapitalize="off"
						autocorrect="off"
						spellcheck="false"
						aria-label={t('intro.input')}
					/>
				</label>
			{/if}
		</div>

		{#if phase === 'prompt'}
			<div class="chips" aria-label={t('intro.quick')}>
				{#each QUICK as id (id)}
					<button
						type="button"
						onclick={() => {
							sfx.click()
							run(nameOf(id))
						}}>{nameOf(id)}</button
					>
				{/each}
				<button
					type="button"
					class="go"
					onclick={() => {
						sfx.enter()
						void leave()
					}}>{t('intro.enter')}</button
				>
			</div>
		{/if}
	</div>

	<div class="foot">
		<button type="button" onclick={toggleSound} aria-pressed={sound.on}>
			{sound.on ? t('intro.soundOn') : t('intro.soundOff')}
		</button>
		<span aria-hidden="true">·</span>
		<button type="button" onclick={() => void leave()}>{t('intro.skip')}</button>
		
	</div>
</div>

<style>
	.intro {
		position: fixed;
		inset: 0;
		z-index: 70;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 1rem;
		padding: 1rem;
		background: var(--bg);
		transition:
			opacity 480ms var(--ease-enter),
			transform 480ms var(--ease-enter);
	}
	.intro.closing {
		opacity: 0;
		transform: scale(1.04);
		pointer-events: none;
	}

	.window {
		display: flex;
		flex-direction: column;
		width: min(46rem, 100%);
		height: min(30rem, 72dvh);
		overflow: hidden;
		border-radius: 1.25rem;
		background: #0e1010;
		color: #e9efed;
		box-shadow:
			0 30px 80px rgb(0 0 0 / 0.25),
			0 0 0 1px rgb(255 255 255 / 0.06) inset;
		font-family: var(--font-mono);
		font-size: 1rem;
		line-height: 1.65;
		letter-spacing: 0;
	}
	.bar {
		display: flex;
		align-items: center;
		gap: 0.4rem;
		padding: 0.75rem 1rem;
		border-bottom: 1px solid rgb(255 255 255 / 0.07);
	}
	.bar span {
		width: 0.7rem;
		height: 0.7rem;
		border-radius: 50%;
		background: rgb(255 255 255 / 0.16);
	}
	.bar i {
		margin-left: 0.6rem;
		font-style: normal;
		font-size: 0.8125rem;
		color: rgb(233 239 237 / 0.45);
	}

	.body {
		flex: 1;
		overflow-y: auto;
		padding: 1rem 1.25rem;
		overscroll-behavior: contain;
	}
	.row {
		display: flex;
		gap: 0.75rem;
		white-space: pre-wrap;
		word-break: break-word;
	}
	.cmd {
		color: #e9efed;
	}
	.row b {
		color: #9feedc;
		font-weight: 400;
	}
	.row b.go {
		color: #e08925;
	}
	.label {
		min-width: 6.5rem;
		color: rgb(233 239 237 / 0.5);
	}
	.label.pad {
		color: #9feedc;
	}
	.err {
		color: #ff9d8a;
	}
	.prompt {
		align-items: baseline;
		gap: 0.6ch;
	}
	.prompt input {
		flex: 1;
		min-width: 0;
		padding: 0;
		border: 0;
		outline: 0;
		background: transparent;
		color: inherit;
		font: inherit;
		/* 16px+ stops iOS zooming into the field */
		font-size: max(1rem, 16px);
		caret-color: #9feedc;
	}
	.caret {
		display: inline-block;
		width: 0.6ch;
		height: 1.1em;
		margin-left: 1px;
		vertical-align: text-bottom;
		background: #9feedc;
		animation: blink 1s steps(1) infinite;
	}
	@keyframes blink {
		50% {
			opacity: 0;
		}
	}

	.chips {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		padding: 0.75rem 1.25rem 1rem;
		border-top: 1px solid rgb(255 255 255 / 0.07);
	}
	.chips button {
		padding: 0.4rem 0.8rem;
		border: 1px solid rgb(255 255 255 / 0.14);
		border-radius: 999px;
		background: transparent;
		color: #e9efed;
		font: inherit;
		font-size: 0.875rem;
		cursor: pointer;
		transition: background-color 160ms var(--ease);
	}
	.chips button:hover {
		background: rgb(255 255 255 / 0.1);
	}
	.chips button.go {
		border-color: #9feedc;
		color: #9feedc;
	}

	.foot {
		display: flex;
		align-items: center;
		gap: 0.6rem;
		font-family: var(--font-mono);
		font-size: 0.8125rem;
		color: var(--fg-muted);
	}
	.foot button {
		padding: 0.25rem 0.1rem;
		border: 0;
		background: transparent;
		color: inherit;
		font: inherit;
		cursor: pointer;
		text-decoration: underline;
		text-underline-offset: 3px;
	}
	.foot button:hover {
		color: var(--fg);
	}

	.sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip: rect(0 0 0 0);
		white-space: nowrap;
	}

	@media (max-width: 520px) {
		.window {
			font-size: 0.875rem;
			height: min(30rem, 66dvh);
		}
		.label {
			min-width: 5.2rem;
		}
	}
</style>
