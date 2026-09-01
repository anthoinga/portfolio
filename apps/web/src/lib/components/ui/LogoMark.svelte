<script lang="ts">
	import mark from '$lib/assets/inga-icon.svg?raw'
</script>

<span class="logo-mark block size-full" aria-hidden="true">
	{@html mark}
</span>

<style>
	.logo-mark :global(svg) {
		display: block;
		width: 100%;
		height: 100%;
	}

	.logo-mark :global(path) {
		fill: currentColor;
	}
</style>
