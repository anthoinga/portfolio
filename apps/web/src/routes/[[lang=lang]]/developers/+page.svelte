<script lang="ts">
	import { sound } from '$lib/actions/sfx'
	import PageHeader from '$lib/components/ui/PageHeader.svelte'
	import { developersContent } from '$lib/agent/developers'
	import { flashCopied } from '$lib/cursorNotice.svelte'
	import { currentLang, t } from '$lib/i18n'
	import { sfx } from '$lib/sfx/palette'
	import type { PageData } from './$types'

	let { data }: { data: PageData } = $props()
	const c = $derived(developersContent(currentLang(), data.siteUrl))
	let copiedCmd = $state('')

	async function copy(cmd: string) {
		try {
			await navigator.clipboard.writeText(cmd)
			copiedCmd = cmd
			flashCopied()
			sfx.confirm()
			setTimeout(() => (copiedCmd = ''), 1800)
		} catch {
			/* clipboard blocked: the command is still selectable */
		}
	}
</script>

<main id="main">
	<div class="page-shell">
		<PageHeader label="API" title={c.title} lead={c.lead} />

		<section aria-labelledby="qs">
			<h2 id="qs" class="font-label">{c.quickstartTitle}</h2>
			{#each c.quickstart as q (q.cmd)}
				<div class="cmd">
					<p>{q.label}</p>
					<div class="code">
						<code>{q.cmd}</code>
						<button type="button" onclick={() => copy(q.cmd)} use:sound={{ click: false }}>
							{copiedCmd === q.cmd ? t('common.copied') : t('common.copy')}
						</button>
					</div>
				</div>
			{/each}
		</section>

		<section aria-labelledby="ep">
			<h2 id="ep" class="font-label">{c.endpointsTitle}</h2>
			<ul class="rows">
				{#each c.endpoints as e (e.path)}
					<li><code>GET {e.path}</code><span>{e.summary}</span></li>
				{/each}
			</ul>
			<p class="note">{c.apiNote}</p>
		</section>

		<section aria-labelledby="dc">
			<h2 id="dc" class="font-label">{c.discoveryTitle}</h2>
			<ul class="rows">
				{#each c.discovery as d (d.path)}
					<li><a href={d.path} use:sound><code>{d.path}</code></a><span>{d.label}</span></li>
				{/each}
			</ul>
		</section>

		<section aria-labelledby="nt" class="last">
			<h2 id="nt" class="font-label">{c.noteTitle}</h2>
			<p class="note">{c.note}</p>
		</section>
	</div>
</main>

<style>
	section {
		margin-bottom: clamp(2.5rem, 6vh, 4rem);
	}
	section.last {
		padding-bottom: clamp(3rem, 8vh, 6rem);
	}
	h2 {
		margin: 0 0 1.25rem;
		font-weight: 500;
		color: var(--fg-muted);
	}
	.cmd p {
		margin: 0 0 0.5rem;
		color: var(--fg-muted);
		font-size: 0.9375rem;
	}
	.cmd {
		margin-bottom: 1.25rem;
	}
	.code {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		padding: 0.85rem 1rem;
		border: 1px solid var(--rule);
		border-radius: 0.9rem;
		background: var(--surface);
	}
	/* Commands stay in one piece (and copy cleanly); long ones scroll sideways. */
	.code code {
		min-width: 0;
		overflow-x: auto;
		white-space: nowrap;
		font-family: var(--font-mono);
		font-size: 0.9375rem;
		letter-spacing: 0;
		scrollbar-width: none;
	}
	.rows code {
		font-family: var(--font-mono);
		font-size: 0.9375rem;
		letter-spacing: 0;
		overflow-wrap: anywhere;
	}
	.code button {
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
	.rows {
		margin: 0;
		padding: 0;
		list-style: none;
	}
	.rows li {
		display: grid;
		gap: 0.25rem 2rem;
		padding: 0.9rem 0;
		border-top: 1px solid var(--rule);
	}
	.rows span {
		color: var(--fg-muted);
	}
	.rows a {
		text-decoration: underline;
		text-decoration-color: var(--rule);
		text-underline-offset: 4px;
	}
	.note {
		max-width: 44rem;
		margin: 1rem 0 0;
		color: var(--fg-muted);
		line-height: 1.55;
	}
	@media (min-width: 768px) {
		.rows li {
			grid-template-columns: minmax(16rem, 22rem) 1fr;
		}
	}
</style>
