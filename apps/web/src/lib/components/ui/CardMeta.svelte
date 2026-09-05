<script lang="ts">
	let { title }: { title: string } = $props()
</script>

<div class="card-title-pill">{title}</div>

<style>
	.card-title-pill {
		display: flex;
		align-items: center;
		box-sizing: border-box;
		max-width: 100%;
		height: 40px;
		padding: 0 16px;
		overflow: hidden;
		border: 1px solid rgb(255 255 255 / 0.14);
		border-radius: 999px;
		background: color-mix(in srgb, var(--accent) 18%, rgb(22 22 22 / 0.94));
		color: #fff;
		font-family: var(--font-sans);
		font-size: 11px;
		font-weight: 600;
		letter-spacing: 0.12em;
		line-height: 1;
		white-space: nowrap;
		text-transform: uppercase;
		text-overflow: ellipsis;
		transition:
			opacity 220ms var(--ease),
			transform 420ms var(--ease),
			background 280ms var(--ease),
			border-color 280ms var(--ease),
			color 280ms var(--ease);
	}

	@media (hover: hover) and (pointer: fine) {
		.card-title-pill {
			opacity: 0;
			transform: translate3d(0, 6px, 0);
		}

		:global(.project-card-link:hover) .card-title-pill,
		:global(.project-card-link:focus-visible) .card-title-pill {
			opacity: 1;
			transform: none;
		}
	}

	@media (prefers-contrast: more) {
		.card-title-pill {
			border-color: rgb(255 255 255 / 0.85);
			background: #161616;
		}
	}

	@media (forced-colors: active) {
		.card-title-pill {
			background: Canvas;
			border: 2px solid CanvasText;
			color: CanvasText;
		}
	}
</style>
