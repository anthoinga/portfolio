<script lang="ts">
	import { page } from '$app/state'
	import { sound as soundAction } from '$lib/actions/sfx'
	import AgentPanel from '$lib/components/chrome/AgentPanel.svelte'
	import { currentLang, href, switchPath, t } from '$lib/i18n'
	import { unlockAudio } from '$lib/sfx/engine'
	import { sfx } from '$lib/sfx/palette'
	import { setSound, sound } from '$lib/sfx/sound.svelte'
	import { DOCK_FONT, DOCK_GAP, MIN_DOCK_FONT } from '$lib/heroDock'
	import { viewport } from '$lib/scrollRoot.svelte'
	import { theme, toggleTheme } from '$lib/theme.svelte'

	let { faded = false, dark = false }: { faded?: boolean; dark?: boolean } = $props()

	const lang = $derived(currentLang())
	const links = $derived([
		{ path: '/', label: t('nav.work') },
		{ path: '/playground', label: t('nav.playground') },
		{ path: '/skills', label: t('nav.skills') },
		{ path: '/work-with-me', label: t('nav.services') }
	].map((l) => ({ ...l, href: href(l.path, lang) })))
	/** Agent is the last numbered row, after the pages. */
	const agentNumber = $derived(String(links.length + 1).padStart(2, '0'))

	/**
	 * The menu sheet, at every width. `menu` is the numbered page list; `agent` replaces it in
	 * place, with a back button to the list.
	 */
	type View = 'closed' | 'menu' | 'agent'
	let view = $state<View>('closed')
	const menuOpen = $derived(view !== 'closed')
	const agentOpen = $derived(view === 'agent')
	let agentRow = $state<HTMLButtonElement>()
	const path = $derived(page.url.pathname)
	const otherLang = $derived(lang === 'es' ? 'en' : 'es')
	const switchHref = $derived(switchPath(path, otherLang))
	const homeHref = $derived(href('/', lang))
	const onHome = $derived(path === homeHref)

	const siteName = $derived((page.data as { settings?: { name?: string } }).settings?.name ?? 'Anthony Inga')

	/*
	 * Site logo: the home page's name in its docked (scrolled) state, on every other page.
	 * Same geometry as heroDock: left edge of .page-shell inside the scroller, centred on the
	 * nav bar, DOCK_FONT px, shrunk only when the bar would crowd it.
	 */
	let logoEl = $state<HTMLAnchorElement>()
	let barEl = $state<HTMLElement>()
	$effect(() => {
		const logo = logoEl
		const bar = barEl
		const scroller = viewport.scroller
		if (!logo || !bar) return
		const text = logo.firstElementChild as HTMLElement
		function place() {
			const root = getComputedStyle(document.documentElement)
			const rem = parseFloat(root.fontSize) || 16
			const padX = parseFloat(root.getPropertyValue('--home-pad-x')) * rem || 24
			const pageMax = parseFloat(root.getPropertyValue('--page-max')) * rem || 1408
			const width = scroller?.clientWidth ?? document.documentElement.clientWidth
			const left = Math.max(padX, (width - pageMax) / 2)
			const r = bar!.getBoundingClientRect()
			const w = text.offsetWidth
			let s = 1
			if (r.width && r.left > left) s = Math.min(1, (r.left - DOCK_GAP - left) / w)
			s = Math.max(s, MIN_DOCK_FONT / DOCK_FONT)
			logo!.style.left = `${left}px`
			logo!.style.top = `${r.top}px`
			logo!.style.height = `${r.height}px`
			text.style.transform = s < 1 ? `scale(${s})` : ''
		}
		const ro = new ResizeObserver(place)
		ro.observe(bar)
		ro.observe(text)
		if (scroller) ro.observe(scroller)
		place()
		void document.fonts?.ready.then(place)
		return () => ro.disconnect()
	})

	function isActive(to: string) {
		if (to === homeHref) return onHome
		return path === to || path.startsWith(`${to}/`)
	}

	function onLang() {
		try {
			localStorage.setItem('lang', otherLang)
		} catch {
			/* ignore */
		}
		sfx.pop()
	}

	function onTheme() {
		const next = toggleTheme()
		sfx.pop(next === 'dark' ? 0.75 : 1)
	}

	function onSound() {
		if (sound.on) {
			sfx.pop(0.75)
			setSound(false)
			return
		}
		setSound(true)
		void unlockAudio().then(() => sfx.ready())
	}

	function setView(next: View) {
		const wasAgent = view === 'agent'
		view = next
		if (wasAgent !== (next === 'agent')) {
			history.replaceState(history.state, '', next === 'agent' ? '#agent' : location.pathname + location.search)
		}
	}

	/** Agent swaps the page list for the panel. */
	function openAgentFromMenu() {
		setView('agent')
		sfx.pop()
	}

	function backToMenu() {
		setView('menu')
		sfx.pop(0.75)
		queueMicrotask(() => agentRow?.focus())
	}

	function toggleMenu() {
		setView(view === 'closed' ? 'menu' : 'closed')
	}

	function closeAll() {
		setView('closed')
	}

	function onKey(e: KeyboardEvent) {
		if (e.key === 'Escape' && view === 'menu') closeAll()
	}

	// A #agent link opens the panel, so it can be shared.
	$effect(() => {
		path
		view = location.hash === '#agent' ? 'agent' : 'closed'
	})
</script>

<svelte:window onkeydown={onKey} />

<!-- Outside the header: the header is its own stacking context, so the blend would not reach the page. -->
{#if !onHome}
	<a href={homeHref} class="site-logo" class:faded bind:this={logoEl} use:soundAction>
		<span>{siteName}</span>
	</a>
{/if}

<header class="site-nav" class:faded class:dark>
	<nav class="bar" aria-label={t('nav.primary')} bind:this={barEl}>

		<button
			type="button"
			class="icon-btn round"
			aria-label={theme.mode === 'dark' ? t('nav.themeToLight') : t('nav.themeToDark')}
			onclick={onTheme}
			use:soundAction={{ click: false }}
		>
			{#if theme.mode === 'dark'}
				<svg viewBox="0 0 24 24" aria-hidden="true"
					><circle cx="12" cy="12" r="4" /><path
						d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"
					/></svg
				>
			{:else}
				<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5Z" /></svg>
			{/if}
		</button>

		<button
			type="button"
			class="icon-btn round"
			aria-label={sound.on ? t('nav.soundOff') : t('nav.soundOn')}
			aria-pressed={sound.on}
			onclick={onSound}
			use:soundAction={{ click: false }}
		>
			<svg viewBox="0 0 24 24" aria-hidden="true">
				<path d="M4 9.5v5h3.5L12 18.5v-13L7.5 9.5H4Z" />
				{#if sound.on}
					<path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11" />
				{:else}
					<path d="m16 9.5 4 5M20 9.5l-4 5" />
				{/if}
			</svg>
		</button>

		<a
			href={switchHref}
			class="lang-btn round"
			hreflang={otherLang === 'es' ? 'es-PE' : 'en'}
			lang={otherLang === 'es' ? 'es-PE' : 'en'}
			aria-label={t('nav.langLabel')}
			onclick={onLang}
			use:soundAction={{ click: false }}
		>
			{otherLang.toUpperCase()}
		</a>

		<button
			type="button"
			class="icon-btn round menu-btn"
			aria-label={menuOpen ? t('nav.menuClose') : t('nav.menuOpen')}
			aria-expanded={menuOpen}
			aria-controls="site-menu"
			onclick={toggleMenu}
			use:soundAction
		>
			<svg viewBox="0 0 24 24" aria-hidden="true">
				{#if menuOpen}
					<path d="m6 6 12 12M18 6 6 18" />
				{:else}
					<path d="M5 8h14M5 16h14" />
				{/if}
			</svg>
		</button>
	</nav>

	{#if view === 'agent'}
		<div id="site-menu" class="overlay">
			<AgentPanel onclose={closeAll} onback={backToMenu} />
		</div>
	{:else if view === 'menu'}
		<div id="site-menu" class="sheet">
			<ul>
				{#each links as link, i (link.href)}
					<li>
						<a
							href={link.href}
							class:active={isActive(link.href)}
							aria-current={isActive(link.href) ? 'page' : undefined}
							use:soundAction
						>
							<span class="num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
							<span class="label">{link.label}</span>
						</a>
					</li>
				{/each}
				<li>
					<button
						type="button"
						class="sub"
						aria-controls="agent-panel"
						bind:this={agentRow}
						onclick={openAgentFromMenu}
						use:soundAction={{ click: false }}
					>
						<span class="num" aria-hidden="true">{agentNumber}</span>
						<span class="label">{t('agent.button')}</span>
						<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 6 6 6-6 6" /></svg>
					</button>
				</li>
			</ul>
		</div>
	{/if}
</header>

<style>
	/* Matches the home name once docked: display serif, white under `exclusion` so it reads on any background. */
	.site-logo {
		position: fixed;
		top: max(0.75rem, env(safe-area-inset-top));
		left: var(--home-pad-x);
		z-index: 41;
		display: flex;
		align-items: center;
		height: 3rem;
		color: #fff;
		mix-blend-mode: exclusion;
		font-family: var(--font-display);
		font-size: 24px;
		line-height: var(--text-display--line-height);
		letter-spacing: var(--text-display--letter-spacing);
		font-weight: 400;
		white-space: nowrap;
		transition: opacity 400ms var(--ease);
	}
	.site-logo > span {
		display: block;
		transform-origin: 0 50%;
	}
	.site-logo.faded {
		opacity: 0;
		pointer-events: none;
	}
	.site-nav {
		position: fixed;
		top: max(0.75rem, env(safe-area-inset-top));
		left: 0;
		right: 0;
		z-index: 40;
		display: flex;
		flex-direction: column;
		/* Right-aligned at every width, so the name / logo has the left side. */
		align-items: flex-end;
		padding-inline: 0.75rem;
		gap: 0.5rem;
		pointer-events: none;
		transition: opacity 400ms var(--ease);
	}
	.site-nav.faded {
		opacity: 0;
	}
	/* Over the always-dark 404 game. */
	.site-nav.dark {
		--surface: rgb(28 32 32 / 0.66);
		--surface-hover: rgb(40 46 46 / 0.9);
		--surface-border: rgb(255 255 255 / 0.1);
		--surface-shadow: 0 8px 24px rgb(0 0 0 / 0.35);
		--fg: #e9efed;
		--fg-muted: rgb(233 239 237 / 0.6);
		--rule: rgb(233 239 237 / 0.14);
	}
	.site-nav > * {
		pointer-events: auto;
	}
	.faded > * {
		pointer-events: none;
	}

	/* Theme, sound, language and menu: one round button each. */
	.bar {
		display: flex;
		align-items: center;
		gap: 0.375rem;
		font-size: 0.8125rem;
		font-weight: 500;
	}
	.round {
		border: 1px solid var(--surface-border);
		border-radius: 999px;
		background: var(--surface);
		box-shadow: var(--surface-shadow);
		-webkit-backdrop-filter: blur(var(--surface-blur)) saturate(1.4);
		backdrop-filter: blur(var(--surface-blur)) saturate(1.4);
		color: var(--fg);
	}
	.icon-btn {
		display: grid;
		place-items: center;
		width: 2.5rem;
		height: 2.5rem;
		border-radius: 999px;
		border: 0;
		background: transparent;
		color: inherit;
		cursor: pointer;
		transition: background-color 200ms var(--ease);
	}
	.icon-btn:hover,
	.lang-btn:hover {
		background: var(--surface-hover);
	}
	.icon-btn svg {
		width: 1.125rem;
		height: 1.125rem;
		fill: none;
		stroke: currentColor;
		stroke-width: 1.75;
		stroke-linecap: round;
		stroke-linejoin: round;
	}

	.lang-btn {
		display: grid;
		place-items: center;
		height: 2.5rem;
		min-width: 2.5rem;
		padding: 0 0.5rem;
		border-radius: 999px;
		font-family: var(--font-mono);
		font-size: 0.75rem;
		letter-spacing: 0.06em;
		color: var(--fg-muted);
		transition:
			background-color 200ms var(--ease),
			color 200ms var(--ease);
	}
	.lang-btn:hover {
		color: var(--fg);
	}

	.sheet {
		width: min(22rem, calc(100% - 2rem));
		padding: 0.5rem;
		border: 1px solid var(--surface-border);
		border-radius: 1.5rem;
		/* More opaque than the buttons: it sits over body text. */
		background: var(--surface-hover);
		box-shadow: var(--surface-shadow);
		-webkit-backdrop-filter: blur(var(--surface-blur)) saturate(1.4);
		backdrop-filter: blur(var(--surface-blur)) saturate(1.4);
	}
	.sheet ul {
		margin: 0;
		padding: 0;
		list-style: none;
	}
	.overlay {
		display: contents;
	}
	/*
	 * Rows: a small sans number, then the label in the display serif.
	 * State lives in the text, not a background: the current page is heavier and full colour,
	 * the rest sit slightly transparent until hovered or focused. The serif ships one weight,
	 * so its active state is thickened with a hairline stroke; the number uses a real weight.
	 */
	.sheet a,
	.sheet .sub {
		display: flex;
		align-items: baseline;
		gap: 0.75rem;
		width: 100%;
		padding: 0.75rem 1rem;
		border: 0;
		border-radius: 1rem;
		background: transparent;
		color: var(--fg);
		font: inherit;
		text-align: left;
		cursor: pointer;
	}
	.num {
		flex: none;
		min-width: 1.25rem;
		font-family: var(--font-sans);
		font-size: 0.75rem;
		font-weight: 400;
		line-height: 1;
		letter-spacing: 0;
		font-variant-numeric: tabular-nums;
	}
	.label {
		font-family: var(--font-display);
		font-size: 1.75rem;
		font-weight: 400;
		line-height: 1.1;
		letter-spacing: -0.01em;
	}
	.sheet a > span,
	.sheet .sub > span,
	.sheet .sub svg {
		opacity: 0.55;
		transition: opacity 200ms var(--ease);
	}
	.sheet a:hover > span,
	.sheet a:focus-visible > span,
	.sheet .sub:hover > *,
	.sheet .sub:focus-visible > * {
		opacity: 0.85;
	}
	.sheet a.active > span {
		opacity: 1;
	}
	.sheet a.active .label {
		-webkit-text-stroke: 0.022em currentColor;
	}
	.sheet a.active .num {
		font-weight: 600;
	}
	.sheet .sub svg {
		align-self: center;
		margin-left: auto;
		width: 1.25rem;
		height: 1.25rem;
		fill: none;
		stroke: currentColor;
		stroke-width: 1.75;
		stroke-linecap: round;
		stroke-linejoin: round;
	}

	/* Scoped so it wins over the base .icon-btn / .lang-btn rules above. */
	.bar .round {
		width: 3rem;
		min-width: 3rem;
		height: 3rem;
		padding: 0;
		background: var(--surface);
	}
	.bar .round:hover {
		background: var(--surface-hover);
	}

</style>
