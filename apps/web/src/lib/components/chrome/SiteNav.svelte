<script lang="ts">
	import { page } from '$app/state'
	import { sound as soundAction } from '$lib/actions/sfx'
	import LogoMark from '$lib/components/ui/LogoMark.svelte'
	import { currentLang, href, switchPath, t } from '$lib/i18n'
	import { unlockAudio } from '$lib/sfx/engine'
	import { sfx } from '$lib/sfx/palette'
	import { setSound, sound } from '$lib/sfx/sound.svelte'
	import { theme, toggleTheme } from '$lib/theme.svelte'

	let { faded = false, dark = false }: { faded?: boolean; dark?: boolean } = $props()

	const lang = $derived(currentLang())
	const links = $derived([
		{ path: '/work', label: t('nav.work') },
		{ path: '/playground', label: t('nav.playground') },
		{ path: '/skills', label: t('nav.skills') },
		{ path: '/work-with-me', label: t('nav.workWithMe') },
		{ path: '/contact', label: t('nav.contact') }
	].map((l) => ({ ...l, href: href(l.path, lang) })))

	let menuOpen = $state(false)
	const path = $derived(page.url.pathname)
	const otherLang = $derived(lang === 'es' ? 'en' : 'es')
	const switchHref = $derived(switchPath(path, otherLang))

	function isActive(to: string) {
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

	$effect(() => {
		path
		menuOpen = false
	})
</script>

<header class="site-nav" class:faded class:dark>
	<nav class="pill" aria-label={t('nav.primary')}>
		<a href={href('/', lang)} class="logo" aria-label={t('nav.home')} use:soundAction>
			<span class="logo-mark"><LogoMark /></span>
		</a>

		<ul class="links">
			{#each links as link (link.href)}
				<li>
					<a
						href={link.href}
						class="link"
						class:active={isActive(link.href)}
						aria-current={isActive(link.href) ? 'page' : undefined}
						use:soundAction
					>
						{link.label}
					</a>
				</li>
			{/each}
		</ul>

		<span class="divider" aria-hidden="true"></span>

		<button
			type="button"
			class="icon-btn"
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
			class="icon-btn"
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
			class="lang-btn"
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
			class="icon-btn menu-btn"
			aria-label={menuOpen ? t('nav.menuClose') : t('nav.menuOpen')}
			aria-expanded={menuOpen}
			aria-controls="site-menu"
			onclick={() => (menuOpen = !menuOpen)}
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

	{#if menuOpen}
		<div id="site-menu" class="sheet">
			<ul>
				{#each links as link (link.href)}
					<li>
						<a
							href={link.href}
							class:active={isActive(link.href)}
							aria-current={isActive(link.href) ? 'page' : undefined}
							use:soundAction
						>
							{link.label}
						</a>
					</li>
				{/each}
			</ul>
		</div>
	{/if}
</header>

<style>
	.site-nav {
		position: fixed;
		top: max(0.75rem, env(safe-area-inset-top));
		left: 0;
		right: 0;
		z-index: 40;
		display: flex;
		flex-direction: column;
		align-items: center;
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

	.pill {
		display: flex;
		align-items: center;
		gap: 0.25rem;
		padding: 0.25rem;
		border: 1px solid var(--surface-border);
		border-radius: 999px;
		background: var(--surface);
		box-shadow: var(--surface-shadow);
		-webkit-backdrop-filter: blur(var(--surface-blur)) saturate(1.4);
		backdrop-filter: blur(var(--surface-blur)) saturate(1.4);
		color: var(--fg);
		font-size: 0.8125rem;
		font-weight: 500;
	}

	.logo,
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
	.logo:hover,
	.icon-btn:hover {
		background: var(--surface-hover);
	}
	.logo-mark {
		display: block;
		width: 1.25rem;
		height: 1.25rem;
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
		background: var(--surface-hover);
		color: var(--fg);
	}

	.links {
		display: none;
		align-items: center;
		gap: 0.125rem;
		margin: 0;
		padding: 0;
		list-style: none;
	}
	.link {
		display: block;
		padding: 0.5rem 0.8rem;
		border-radius: 999px;
		color: var(--fg-muted);
		white-space: nowrap;
		transition:
			color 200ms var(--ease),
			background-color 200ms var(--ease);
	}
	.link:hover {
		color: var(--fg);
		background: var(--surface-hover);
	}
	.link.active {
		color: var(--fg);
		background: var(--surface-hover);
	}

	.divider {
		display: none;
		width: 1px;
		height: 1.25rem;
		margin: 0 0.25rem;
		background: var(--rule);
	}

	.sheet {
		width: min(22rem, calc(100% - 2rem));
		padding: 0.5rem;
		border: 1px solid var(--surface-border);
		border-radius: 1.5rem;
		background: var(--surface);
		box-shadow: var(--surface-shadow);
		-webkit-backdrop-filter: blur(var(--surface-blur)) saturate(1.4);
		backdrop-filter: blur(var(--surface-blur)) saturate(1.4);
	}
	.sheet ul {
		margin: 0;
		padding: 0;
		list-style: none;
	}
	.sheet a {
		display: block;
		padding: 0.85rem 1rem;
		border-radius: 1rem;
		font-family: var(--font-display);
		font-size: 1.75rem;
		line-height: 1.1;
		color: var(--fg);
	}
	.sheet a.active,
	.sheet a:hover {
		background: var(--surface-hover);
	}

	@media (min-width: 900px) {
		.links,
		.divider {
			display: flex;
		}
		.menu-btn,
		.sheet {
			display: none;
		}
	}
</style>
