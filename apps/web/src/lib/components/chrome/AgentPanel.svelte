<script lang="ts">
	import { page } from '$app/state'
	import { sound } from '$lib/actions/sfx'
	import { flashCopied } from '$lib/cursorNotice.svelte'
	import { currentLang, href, t } from '$lib/i18n'
	import { sfx } from '$lib/sfx/palette'

	let { onclose }: { onclose: () => void } = $props()

	const lang = $derived(currentLang())
	const base = $derived((page.data as { siteUrl?: string }).siteUrl ?? '')
	const prefix = $derived(lang === 'es' ? '/es' : '')
	const commands = $derived([
		{ label: t('agent.cmdIndex'), text: `curl ${base}${prefix}/llms.txt` },
		{ label: t('agent.cmdMarkdown'), text: `curl -H 'Accept: text/markdown' ${base}${prefix}/work` },
		{ label: t('agent.cmdApi'), text: `curl ${base}/api/v1/profile${lang === 'es' ? '?lang=es' : ''}` }
	])
	let copied = $state('')

	async function copy(text: string) {
		try {
			await navigator.clipboard.writeText(text)
			copied = text
			flashCopied()
			sfx.confirm()
			setTimeout(() => (copied = ''), 1800)
		} catch {
			/* clipboard blocked: the text is still selectable */
		}
	}

	function onKey(e: KeyboardEvent) {
		if (e.key === 'Escape') onclose()
	}
</script>

<svelte:window onkeydown={onKey} />

<section class="panel" role="dialog" aria-label={t('agent.title')}>
	<header>
		<h2>{t('agent.title')}</h2>
		<button type="button" class="x" aria-label={t('agent.close')} onclick={onclose} use:sound>×</button>
	</header>
	<p>{t('agent.body')}</p>
	<ul>
		{#each commands as c (c.text)}
			<li>
				<span>{c.label}</span>
				<div class="code">
					<code>{c.text}</code>
					<button type="button" onclick={() => copy(c.text)} use:sound={{ click: false }}>
						{copied === c.text ? t('common.copied') : t('common.copy')}
					</button>
				</div>
			</li>
		{/each}
	</ul>
	<div class="foot">
		<button
			type="button"
			class="prompt"
			onclick={() => copy(t('agent.promptText', { url: base }))}
			use:sound={{ click: false }}
		>
			{copied === t('agent.promptText', { url: base }) ? t('common.copied') : t('agent.prompt')}
		</button>
		<a href={href('/developers')} onclick={onclose} use:sound>{t('agent.portal')}</a>
	</div>
</section>

<style>
	.panel {
		/* The nav is click-through; the panel is not. */
		pointer-events: auto;
		width: min(34rem, calc(100% - 2rem));
		padding: 1.1rem 1.25rem 1.25rem;
		border: 1px solid var(--surface-border);
		border-radius: 1.5rem;
		background: var(--surface);
		box-shadow: var(--surface-shadow);
		-webkit-backdrop-filter: blur(var(--surface-blur)) saturate(1.4);
		backdrop-filter: blur(var(--surface-blur)) saturate(1.4);
		color: var(--fg);
		animation: rise 400ms var(--ease-enter) backwards;
	}
	header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
	}
	h2 {
		margin: 0;
		font-family: var(--font-display);
		font-size: 1.75rem;
		font-weight: 400;
		line-height: 1.1;
		letter-spacing: -0.02em;
	}
	.x {
		width: 2rem;
		height: 2rem;
		border: 0;
		border-radius: 50%;
		background: transparent;
		color: var(--fg-muted);
		font-size: 1.5rem;
		line-height: 1;
		cursor: pointer;
	}
	.x:hover {
		background: var(--surface-hover);
	}
	p {
		margin: 0.6rem 0 1rem;
		font-size: 0.9375rem;
		line-height: 1.5;
		color: var(--fg-muted);
	}
	ul {
		display: grid;
		gap: 0.75rem;
		margin: 0;
		padding: 0;
		list-style: none;
	}
	li span {
		display: block;
		margin-bottom: 0.25rem;
		font-size: 0.8125rem;
		color: var(--fg-muted);
	}
	.code {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.75rem;
		padding: 0.6rem 0.75rem;
		border: 1px solid var(--rule);
		border-radius: 0.8rem;
	}
	code {
		min-width: 0;
		overflow-x: auto;
		white-space: nowrap;
		font-family: var(--font-mono);
		font-size: 0.8125rem;
		letter-spacing: 0;
		scrollbar-width: none;
	}
	.code button,
	.prompt {
		flex: none;
		padding: 0.3rem 0.8rem;
		border: 1px solid var(--rule);
		border-radius: 999px;
		background: transparent;
		color: var(--accent);
		font: inherit;
		font-size: 0.8125rem;
		cursor: pointer;
	}
	.foot {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: 0.75rem;
		margin-top: 1rem;
	}
	.prompt {
		padding: 0.55rem 1rem;
		border-color: var(--fg);
		background: var(--fg);
		color: var(--bg);
		font-size: 0.875rem;
	}
	.foot a {
		font-size: 0.875rem;
		text-decoration: underline;
		text-underline-offset: 4px;
	}
</style>
