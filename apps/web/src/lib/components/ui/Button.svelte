<script lang="ts">
	import type { Snippet } from 'svelte'
	import type { HTMLAnchorAttributes } from 'svelte/elements'
	import { sound } from '$lib/actions/sfx'

	let {
		href,
		variant = 'solid',
		children,
		...rest
	}: {
		href: string
		variant?: 'solid' | 'ghost'
		children: Snippet
	} & HTMLAnchorAttributes = $props()
</script>

<a {href} class="btn {variant}" use:sound {...rest}>
	{@render children()}
</a>

<style>
	.btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		padding: 0.85rem 1.4rem;
		border: 1px solid var(--fg);
		border-radius: 999px;
		font-size: 0.9375rem;
		font-weight: 500;
		letter-spacing: -0.005em;
		white-space: nowrap;
		transition:
			background-color 220ms var(--ease),
			color 220ms var(--ease),
			transform 220ms var(--ease);
	}
	.btn:active {
		transform: scale(0.97);
	}
	.solid {
		background: var(--fg);
		color: var(--bg);
	}
	.solid:hover {
		background: transparent;
		color: var(--fg);
	}
	.ghost {
		background: transparent;
		color: var(--fg);
		border-color: var(--rule);
	}
	.ghost:hover {
		border-color: var(--fg);
	}
</style>
