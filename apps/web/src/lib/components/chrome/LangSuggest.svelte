<script lang="ts">
	import { onMount } from 'svelte'
	import { sound } from '$lib/actions/sfx'
	import { currentLang, switchPath, t } from '$lib/i18n'

	let show = $state(false)

	/**
	 * Offers Spanish once, on the English home page, to visitors whose browser
	 * prefers it. It never redirects on its own: that would break shared links.
	 */
	onMount(() => {
		try {
			const prefersEs = navigator.languages?.some((l) => l.toLowerCase().startsWith('es'))
			const decided = localStorage.getItem('lang')
			show = currentLang() === 'en' && location.pathname === '/' && !!prefersEs && !decided
		} catch {
			show = false
		}
	})

	function decide(choice: 'en' | 'es') {
		try {
			localStorage.setItem('lang', choice)
		} catch {
			/* ignore */
		}
		show = false
	}
</script>

{#if show}
	<aside class="suggest" lang="es-PE" aria-label="Idioma">
		<span>{t('lang.suggest', undefined, 'es')}</span>
		<a href={switchPath('/', 'es')} onclick={() => decide('es')} use:sound>{t('lang.yes', undefined, 'es')}</a>
		<button type="button" onclick={() => decide('en')} use:sound>{t('lang.no', undefined, 'es')}</button>
	</aside>
{/if}

<style>
	.suggest {
		position: fixed;
		left: 50%;
		bottom: max(1rem, env(safe-area-inset-bottom));
		z-index: 35;
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: center;
		gap: 0.5rem 0.9rem;
		width: max-content;
		max-width: calc(100% - 2rem);
		transform: translateX(-50%);
		padding: 0.6rem 1rem;
		border: 1px solid var(--surface-border);
		border-radius: 999px;
		background: var(--surface);
		box-shadow: var(--surface-shadow);
		-webkit-backdrop-filter: blur(var(--surface-blur));
		backdrop-filter: blur(var(--surface-blur));
		font-size: 0.875rem;
		animation: rise 600ms var(--ease-enter) 1s backwards;
	}
	a {
		font-weight: 600;
		color: var(--accent);
		text-decoration: underline;
		text-underline-offset: 3px;
	}
	button {
		padding: 0;
		border: 0;
		background: transparent;
		color: var(--fg-muted);
		font: inherit;
		cursor: pointer;
	}
</style>
