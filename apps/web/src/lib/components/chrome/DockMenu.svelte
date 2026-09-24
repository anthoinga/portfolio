<script lang="ts">
	import { subscribeMedia } from '$lib/motion'

	type Item = { label: string; icon: 'overview' | 'product' | 'pricing' | 'enterprise' | 'api' | 'support' }
	type Sub = { label: string }

	const left: Item[] = [
		{ label: 'Overview', icon: 'overview' },
		{ label: 'Product', icon: 'product' },
		{ label: 'Pricing', icon: 'pricing' }
	]
	const right: Item[] = [
		{ label: 'Enterprise', icon: 'enterprise' },
		{ label: 'Integrations & API', icon: 'api' },
		{ label: 'Customer Support', icon: 'support' }
	]
	const subs: Sub[] = [
		{ label: 'Status' },
		{ label: 'Documentation' },
		{ label: 'Roadmap' },
		{ label: 'Community' },
		{ label: 'Blog' },
		{ label: 'Developers' }
	]

	let open = $state(false)
	let resources = $state(false)
	let reduced = $state(false)
	let hover = $state<string | null>(null)

	$effect(() => subscribeMedia('(prefers-reduced-motion: reduce)', (m) => (reduced = m)))

	function toggle() {
		if (open) {
			resources = false
			open = false
		} else {
			open = true
		}
	}

	function toggleResources() {
		if (!open) return
		resources = !resources
	}
</script>

<div
	class="dock"
	class:is-open={open}
	class:is-resources={resources}
	class:is-reduced={reduced}
	role="navigation"
	aria-label="Acme Inc. dock menu"
>
	<span class="glow" aria-hidden="true"><span class="glow-ring"></span></span>
	<span class="stroke" aria-hidden="true"></span>
	<div class="shell">
	<header class="head">
		<span class="brand">
			<span class="logo" aria-hidden="true">
				<svg viewBox="0 0 16 16" fill="currentColor">
					<path d="M8 1.2 9.4 6.6 14.8 8 9.4 9.4 8 14.8 6.6 9.4 1.2 8l5.4-1.4L8 1.2Z" />
				</svg>
			</span>
			<span class="name">Acme Inc.</span>
		</span>
		<button
			type="button"
			class="toggle"
			onclick={toggle}
			aria-expanded={open}
			aria-label={open ? 'Collapse menu' : 'Expand menu'}
		>
			{#if open}
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true">
					<rect x="4" y="5" width="16" height="14" rx="2" />
					<path d="M9 5v14" />
				</svg>
			{:else}
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true">
					<rect x="5" y="6" width="14" height="12" rx="2" />
					<path d="M14 6v12" />
				</svg>
			{/if}
		</button>
	</header>

	<div class="panel" inert={!open || undefined} aria-hidden={!open}>
		<div class="panel-inner">
			<div class="cols">
				<div class="col">
					{#each left as item}
						<button
							type="button"
							class="item"
							class:is-hot={hover === item.label}
							onpointerenter={() => (hover = item.label)}
							onpointerleave={() => (hover = null)}
						>
							<span class="ico" aria-hidden="true">{@render icon(item.icon)}</span>
							<span>{item.label}</span>
						</button>
					{/each}
					<button
						type="button"
						class="item resources"
						class:is-hot={hover === 'Resources' || resources}
						aria-expanded={resources}
						onclick={toggleResources}
						onpointerenter={() => (hover = 'Resources')}
						onpointerleave={() => (hover = null)}
					>
						<span class="ico" aria-hidden="true">{@render icon('resources')}</span>
						<span>Resources</span>
						<svg class="chev" class:up={resources} viewBox="0 0 12 12" aria-hidden="true">
							<path d="M3 4.5 6 7.5 9 4.5" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" />
						</svg>
					</button>
				</div>
				<div class="col">
					{#each right as item}
						<button
							type="button"
							class="item"
							class:is-hot={hover === item.label}
							onpointerenter={() => (hover = item.label)}
							onpointerleave={() => (hover = null)}
						>
							<span class="ico" aria-hidden="true">{@render icon(item.icon)}</span>
							<span>{item.label}</span>
						</button>
					{/each}
				</div>
			</div>

			<div class="subs" class:show={resources}>
				<div class="subs-inner">
					{#each subs as sub}
						<button
							type="button"
							class="item sub"
							class:is-hot={hover === sub.label}
							onpointerenter={() => (hover = sub.label)}
							onpointerleave={() => (hover = null)}
						>
							<span class="ico corner" aria-hidden="true">
								<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4">
									<path d="M3 3v6a2 2 0 0 0 2 2h8" stroke-linecap="round" />
									<path d="m10 8 3 3-3 3" stroke-linecap="round" stroke-linejoin="round" />
								</svg>
							</span>
							<span>{sub.label}</span>
						</button>
					{/each}
				</div>
			</div>
		</div>
	</div>
	</div>
</div>

{#snippet icon(name: string)}
	{#if name === 'overview'}
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"
			><path d="M8 7h8M8 12h8M8 17h5" stroke-linecap="round" /><rect x="4" y="4" width="16" height="16" rx="2" /></svg
		>
	{:else if name === 'product'}
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"
			><rect x="5" y="5" width="14" height="14" rx="2" /><path d="M9 5v14M15 5v14" /></svg
		>
	{:else if name === 'pricing'}
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"
			><path d="M12 4v16M15.5 8.5c0-1.5-1.3-2.5-3.5-2.5S8.5 7.2 8.5 8.7c0 3.3 7 1.5 7 5.1 0 1.6-1.4 2.7-3.5 2.7S8.5 15 8.5 13.5" stroke-linecap="round" /></svg
		>
	{:else if name === 'enterprise'}
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"
			><path d="M4 20V8l8-4 8 4v12" /><path d="M9 20v-6h6v6M4 20h16" /></svg
		>
	{:else if name === 'api'}
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"
			><circle cx="7" cy="12" r="2" /><circle cx="17" cy="7" r="2" /><circle cx="17" cy="17" r="2" /><path
				d="M9 12h4.5M15.2 8.2l-2.7 2.7M15.2 15.8l-2.7-2.7"
			/></svg
		>
	{:else if name === 'support'}
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"
			><circle cx="12" cy="9" r="3.2" /><path d="M5.5 19c1.5-3 4-4.5 6.5-4.5S17 16 18.5 19" stroke-linecap="round" /></svg
		>
	{:else}
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"
			><path d="m7 16 3-8 3 5 2-3 2 6" stroke-linecap="round" stroke-linejoin="round" /><circle cx="7" cy="16" r="1.2" fill="currentColor" stroke="none" /><rect
				x="12"
				y="14"
				width="3"
				height="3"
				rx="0.4"
				fill="currentColor"
				stroke="none"
			/><circle cx="18" cy="16" r="1.2" fill="currentColor" stroke="none" /></svg
		>
	{/if}
{/snippet}

<style>
	@property --glow-turn {
		syntax: '<angle>';
		inherits: true;
		initial-value: 0deg;
	}

	@keyframes glow-turn {
		to {
			--glow-turn: 360deg;
		}
	}

	.dock {
		--dock: rgb(42 42 42 / 0.62);
		--ink: #f4f4f4;
		--muted: #b8b8b8;
		--hot: rgb(0 0 0 / 0.28);
		--dock-ease: var(--ease-enter, cubic-bezier(0.81, 0.03, 0.06, 1));
		position: relative;
		display: flex;
		flex-direction: column;
		--glow-turn: 0deg;
		--glow-ring: conic-gradient(
			from var(--glow-turn),
			transparent 0deg 214deg,
			rgb(124 92 255 / 0.15) 250deg,
			#b794f6 286deg,
			#f0abfc 308deg,
			#fb923c 334deg,
			#ffe7c2 350deg,
			transparent 360deg
		);
		width: min(20.5rem, 92%);
		transform: scale(1.18);
		transform-origin: center;
		border-radius: 0.85rem;
		color: var(--ink);
		animation: glow-turn 2.8s linear infinite;
		transition:
			width 340ms var(--dock-ease),
			border-radius 340ms var(--dock-ease);
	}

	.shell {
		position: relative;
		z-index: 1;
		padding: 0.55rem 1rem;
		border-radius: inherit;
		background: var(--dock);
		-webkit-backdrop-filter: blur(18px) saturate(1.2);
		backdrop-filter: blur(18px) saturate(1.2);
		box-shadow:
			0 18px 40px rgb(0 0 0 / 0.22),
			0 1px 0 rgb(255 255 255 / 0.1) inset,
			inset 0 0 14px rgb(0 0 0 / 0.16);
		border: 1px solid rgb(255 255 255 / 0.1);
		overflow: hidden;
		transition: padding 340ms var(--dock-ease);
	}

	.glow,
	.stroke {
		position: absolute;
		border-radius: inherit;
		pointer-events: none;
		transition: opacity 280ms ease;
	}

	.glow {
		inset: -22px;
		z-index: 0;
		filter: blur(12px);
	}

	.glow-ring,
	.stroke {
		background: var(--glow-ring);
		-webkit-mask:
			linear-gradient(#fff 0 0) content-box,
			linear-gradient(#fff 0 0);
		-webkit-mask-composite: xor;
		mask:
			linear-gradient(#fff 0 0) content-box,
			linear-gradient(#fff 0 0);
		mask-composite: exclude;
	}

	.glow-ring {
		position: absolute;
		inset: 21px;
		border-radius: inherit;
		padding: 2px;
	}

	.stroke {
		inset: 0;
		z-index: 2;
		padding: 1.5px;
	}

	.dock.is-open {
		width: min(26.5rem, 94%);
		border-radius: 1rem;
		animation: none;
	}

	.dock.is-open .shell {
		padding: 0.7rem 1rem;
	}

	.dock.is-open .glow,
	.dock.is-open .stroke,
	.dock.is-reduced .glow,
	.dock.is-reduced .stroke {
		opacity: 0;
	}

	.head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.75rem;
		min-height: 2.1rem;
	}

	.brand {
		display: flex;
		align-items: center;
		gap: 0.55rem;
		min-width: 0;
	}

	.logo {
		display: grid;
		place-items: center;
		width: 1.85rem;
		height: 1.85rem;
		border-radius: 0.4rem;
		background: #fff;
		color: #111;
		flex: none;
	}

	.logo svg {
		width: 1.05rem;
		height: 1.05rem;
	}

	.name {
		font-size: 1.1rem;
		font-weight: 600;
		letter-spacing: -0.02em;
		white-space: nowrap;
	}

	.toggle {
		display: grid;
		place-items: center;
		width: 2.15rem;
		height: 2.15rem;
		border: 0;
		border-radius: 0.45rem;
		background: transparent;
		color: var(--muted);
		cursor: pointer;
		flex: none;
		transition: background 180ms ease, color 180ms ease;
	}

	.toggle:hover {
		background: rgb(255 255 255 / 0.08);
		color: #fff;
	}

	.toggle svg {
		width: 1.25rem;
		height: 1.25rem;
	}

	.panel {
		display: grid;
		grid-template-rows: 0fr;
		opacity: 0;
		transition:
			grid-template-rows 340ms var(--dock-ease),
			opacity 200ms ease;
		pointer-events: none;
	}

	.dock.is-open .panel {
		grid-template-rows: 1fr;
		opacity: 1;
		pointer-events: auto;
		margin-top: 0.55rem;
		transition:
			grid-template-rows 340ms var(--dock-ease),
			opacity 240ms 40ms ease;
	}

	.panel-inner {
		overflow: hidden;
		min-height: 0;
	}

	.cols {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 0.15rem 1rem;
	}

	.col {
		display: flex;
		flex-direction: column;
		gap: 0.12rem;
	}

	.item {
		display: flex;
		align-items: center;
		gap: 0.55rem;
		width: 100%;
		padding: 0.48rem 0.55rem;
		border: 0;
		border-radius: 0.65rem;
		background: transparent;
		color: var(--muted);
		font: inherit;
		font-size: 0.96rem;
		font-weight: 500;
		letter-spacing: -0.01em;
		text-align: left;
		cursor: pointer;
		transition: background 160ms ease, color 160ms ease;
	}

	.item.is-hot {
		background: var(--hot);
		color: #fff;
	}

	.ico {
		display: grid;
		place-items: center;
		width: 1.22rem;
		height: 1.22rem;
		flex: none;
		opacity: 0.9;
	}

	.ico :global(svg) {
		width: 100%;
		height: 100%;
	}

	.resources {
		justify-content: flex-start;
	}

	.chev {
		width: 0.85rem;
		height: 0.85rem;
		margin-left: auto;
		opacity: 0.7;
		transition: transform 200ms var(--ease, cubic-bezier(0.33, 1, 0.68, 1));
	}

	.chev.up {
		transform: rotate(180deg);
	}

	.subs {
		display: grid;
		grid-template-rows: 0fr;
		opacity: 0;
		transition:
			grid-template-rows 280ms var(--dock-ease),
			opacity 180ms ease;
	}

	.subs.show {
		grid-template-rows: 1fr;
		opacity: 1;
		margin-top: 0.35rem;
		transition:
			grid-template-rows 280ms var(--dock-ease),
			opacity 200ms 30ms ease;
	}

	.subs-inner {
		overflow: hidden;
		min-height: 0;
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 0.1rem 1rem;
	}

	.sub {
		font-size: 0.9rem;
	}

	.corner :global(svg) {
		width: 1.05rem;
		height: 1.05rem;
	}

	.dock.is-reduced,
	.dock.is-reduced .panel,
	.dock.is-reduced .subs,
	.dock.is-reduced .chev {
		transition: none;
	}

	.dock.is-reduced {
		animation: none;
	}

	@media (max-width: 420px) {
		.dock.is-open {
			width: min(22rem, 96%);
		}

		.item {
			font-size: 0.88rem;
			padding: 0.42rem 0.45rem;
		}
	}
</style>
