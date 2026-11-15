<script lang="ts">
	import '../app.css'
	import { afterNavigate, goto } from '$app/navigation'
	import { page } from '$app/state'
	import { onMount } from 'svelte'
	import CursorTakeover from '$lib/components/chrome/CursorTakeover.svelte'
	import Footer from '$lib/components/chrome/Footer.svelte'
	import Header from '$lib/components/chrome/Header.svelte'
	import LangSuggest from '$lib/components/chrome/LangSuggest.svelte'
	import Seo from '$lib/components/chrome/Seo.svelte'
	import SiteNav from '$lib/components/chrome/SiteNav.svelte'
	import { HTML_LANG, currentLang, isProjectPath, t } from '$lib/i18n'
	import { closeIntro, intro, startIntro } from '$lib/intro.svelte'
	import { nopeChrome } from '$lib/nopeChrome.svelte'
	import { bindScroller, viewport } from '$lib/scrollRoot.svelte'
	import { attachOverscroll, bottomProgress, consumeOverscroll, overscroll, topProgress } from '$lib/overscroll.svelte'
	import { navMemory } from '$lib/scroll'
	import { unlockAudio } from '$lib/sfx/engine'
	import { sfx } from '$lib/sfx/palette'
	import { loadSoundPreference } from '$lib/sfx/sound.svelte'
	import { syncTheme } from '$lib/theme.svelte'
	import type { LayoutData } from './$types'

	let { children, data }: { children: import('svelte').Snippet; data: LayoutData } = $props()

	const pathname = $derived(page.url.pathname)
	const onProject = $derived(isProjectPath(pathname))
	const is404 = $derived(page.status === 404)
	const navFaded = $derived(is404 && !nopeChrome.onTitle)

	onMount(() => {
		syncTheme()
		loadSoundPreference()
		void startIntro()
		if (data.analytics === 'vercel') void import('@vercel/analytics').then((m) => m.inject())
		// Browsers only allow audio from a gesture: unlock on the first one.
		const unlock = () => void unlockAudio()
		window.addEventListener('pointerdown', unlock, { once: true })
		window.addEventListener('keydown', unlock, { once: true })
		return () => {
			window.removeEventListener('pointerdown', unlock)
			window.removeEventListener('keydown', unlock)
		}
	})

	// Keep <html lang> right after client-side navigation (the server sets it for first loads).
	$effect(() => {
		document.documentElement.lang = HTML_LANG[currentLang()]
	})

	let bottomArmed = true

	afterNavigate(({ from, to }) => {
		bottomArmed = true
		if (onProject) return
		// Only coming back from a case study restores the old position.
		const y = from && isProjectPath(from.url.pathname) ? navMemory.workspaceScroll : 0
		const hash = to?.url.hash.slice(1)
		const apply = () => {
			const target = hash ? document.getElementById(decodeURIComponent(hash)) : null
			if (target) target.scrollIntoView({ block: 'start' })
			else if (viewport.scroller) viewport.scroller.scrollTop = y
			viewport.scrollY = viewport.scroller?.scrollTop ?? y
		}
		apply()
		requestAnimationFrame(apply)
	})

	// A soft thud on reaching the very bottom of a page; re-arms after scrolling back up.
	$effect(() => {
		const y = viewport.scrollY
		const el = viewport.scroller
		if (!el || onProject) return
		const max = el.scrollHeight - el.clientHeight
		if (max < 120) return
		if (bottomArmed && max - y <= 2) {
			bottomArmed = false
			sfx.thud()
		} else if (!bottomArmed && max - y > 200) {
			bottomArmed = true
		}
	})

	$effect(() => {
		pathname
		if (!onProject || !viewport.scroller) return
		return attachOverscroll(viewport.scroller)
	})

	$effect(() => {
		if (!onProject) return
		if (!overscroll.topDone && !overscroll.bottomDone) return
		const hold = window.setTimeout(() => {
			if (consumeOverscroll('top') || consumeOverscroll('bottom')) {
				sfx.whooshDown()
				void goto(navMemory.returnTo, { noScroll: true })
			}
		}, 520)
		return () => window.clearTimeout(hold)
	})
</script>

<a class="skip-link" href="#main">{t('common.skip')}</a>

<Seo settings={data.settings} siteUrl={data.siteUrl} />

{#if !onProject}
	<SiteNav faded={navFaded} dark={is404} />
{/if}

<div class="scroll-root" use:bindScroller>
	{#if onProject}
		<Header
			overscrollTop={topProgress()}
			overscrollTopStarted={overscroll.topStarted}
			overscrollBottom={bottomProgress()}
			overscrollBottomStarted={overscroll.bottomStarted}
		/>
	{/if}
	{@render children()}
	{#if !onProject && !is404}
		<Footer settings={data.settings} />
	{/if}
</div>
<CursorTakeover />
{#if !onProject && !is404}
	<LangSuggest />
{/if}

<!-- Painted before first paint (see app.html) for first-time visitors; the terminal loads into it. -->
<div class="intro-shell">
	{#if intro.Component}
		<intro.Component onclose={closeIntro} />
	{/if}
</div>

<style>
	.intro-shell {
		display: none;
	}
	:global(html.intro-pending) .intro-shell {
		display: block;
		position: fixed;
		inset: 0;
		z-index: 70;
		background: var(--bg);
	}
	/* The page waits underneath: hidden from sight and from assistive tech until the intro ends. */
	:global(html.intro-pending) .scroll-root,
	:global(html.intro-pending) :global(.site-nav) {
		visibility: hidden;
	}
</style>
