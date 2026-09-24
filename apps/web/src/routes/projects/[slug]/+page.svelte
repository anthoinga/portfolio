<script lang="ts">
	import PortableBody from '$lib/components/content/PortableBody.svelte'
	import { activePageColor, inkFor, PAGE_COLOR_LINE } from '$lib/pageColor'
	import { createProjectMotion } from '$lib/projectHandoff.svelte'
	import { viewport } from '$lib/scrollRoot.svelte'
	import { projectCssVars, projectSurface } from '$lib/theme'
	import type { PageData } from './$types'

	let { data }: { data: PageData } = $props()
	const project = $derived(data.project)
	const surface = $derived(projectSurface(project))
	const motion = createProjectMotion(() => project)
	let article = $state<HTMLElement | null>(null)
	let posterImg = $state<HTMLImageElement | null>(null)
	let inkRoot = $state<HTMLElement | null>(null)
	let tone = $state<string | null>(null)
	const opening = $derived(project.pageColor ?? surface.background)
	const background = $derived(tone ?? opening)
	const shell = $derived(inkFor(background, project))

	$effect(() => {
		const stops = project.colorStops
		const fallback = opening
		const node = article
		const scroller = viewport.scroller
		tone = null
		if (!stops?.length || !node || !scroller) return

		const read = () => {
			const bounds = scroller.getBoundingClientRect()
			const markers = [...node.querySelectorAll<HTMLElement>('[data-page-color]')].map((el) => {
				const box = el.getBoundingClientRect()
				return {
					top: box.top,
					bottom: box.bottom,
					color: el.dataset.pageColor || fallback,
					when: el.dataset.pageWhen || 'cross',
					line: el.dataset.pageLine ? Number(el.dataset.pageLine) : undefined
				}
			})
			tone = activePageColor(
				markers,
				{ top: bounds.top, bottom: bounds.bottom, line: bounds.top + bounds.height * PAGE_COLOR_LINE },
				fallback
			)
		}

		read()
		scroller.addEventListener('scroll', read, { passive: true })
		const observer = new ResizeObserver(read)
		observer.observe(node)
		return () => {
			scroller.removeEventListener('scroll', read)
			observer.disconnect()
		}
	})

	$effect(() => {
		const img = posterImg
		const root = inkRoot
		const scroller = viewport.scroller
		if (!img || !root) return

		const paint = () => {
			if (!img.naturalWidth) return
			const poster = img.getBoundingClientRect()
			const scale = Math.max(poster.width / img.naturalWidth, poster.height / img.naturalHeight)
			const dw = img.naturalWidth * scale
			const dh = img.naturalHeight * scale
			const cropX = (dw - poster.width) / 2
			const cropY = (dh - poster.height) / 2
			const url = `url("${img.currentSrc}")`
			for (const el of root.querySelectorAll<HTMLElement>('p, dt, dd')) {
				const box = el.getBoundingClientRect()
				el.style.backgroundImage = url
				el.style.backgroundRepeat = 'no-repeat'
				el.style.backgroundSize = `${dw}px ${dh}px`
				el.style.backgroundPosition = `${poster.left - cropX - box.left}px ${poster.top - cropY - box.top}px`
			}
		}

		paint()
		img.addEventListener('load', paint)
		scroller?.addEventListener('scroll', paint, { passive: true })
		window.addEventListener('resize', paint)
		const observer = new ResizeObserver(paint)
		observer.observe(img)
		return () => {
			img.removeEventListener('load', paint)
			scroller?.removeEventListener('scroll', paint)
			window.removeEventListener('resize', paint)
			observer.disconnect()
		}
	})
</script>

<svg class="pointer-events-none absolute h-0 w-0" aria-hidden="true">
	<filter id="meta-ink" color-interpolation-filters="sRGB">
		<feColorMatrix type="saturate" values="0" />
		<feComponentTransfer>
			<feFuncR type="discrete" tableValues="1 0" />
			<feFuncG type="discrete" tableValues="1 0" />
			<feFuncB type="discrete" tableValues="1 0" />
		</feComponentTransfer>
	</filter>
</svg>

<article
	bind:this={article}
	class="project-article relative z-10 overflow-hidden rounded-card pb-24"
	data-type={project.type}
	style="{projectCssVars(project)}; --bg:{background}; --fg:{shell}; background-color:{background}; color:{shell}; transform:translate3d({motion.articleX}px, {motion.articleY}px, 0) scale({motion.articleScale}); opacity:{motion.articleOpacity}; transform-origin:{motion.transformOrigin}; transition:{motion.articleTransition}; will-change:transform, opacity;"
>
	{#snippet projectMeta(blend: boolean)}
		<div
			class="w-fit max-w-[26ch] text-left text-sm leading-[1.3] lg:text-base {blend ? 'meta-ink' : ''}"
		>
			{#if project.brief}
				{#each project.brief.paragraphs as paragraph, i}
					<p class:mt-4={i > 0}>{paragraph}</p>
				{/each}
				<dl class="mt-6 space-y-5 lg:mt-8">
					{#each project.brief.facts as fact}
						<div>
							<dt class="opacity-50">{fact.label}</dt>
							{#each fact.items as item}
								<dd>{item}</dd>
							{/each}
						</div>
					{/each}
				</dl>
			{:else}
				{#if project.description}
					<p class="text-lg leading-[1.12] tracking-[-0.018em] lg:text-2xl">{project.description}</p>
				{/if}
				{#if project.scope}
					<p class="mt-4 opacity-50 lg:mt-8">{project.scope}</p>
				{/if}
				<div class="mt-4 opacity-50 lg:mt-6">
					{#each project.tags as tag}<div>{tag}</div>{/each}
				</div>
			{/if}
		</div>
	{/snippet}

	<header
		class="relative z-20 grid grid-cols-[1fr_1fr_4fr] gap-4 px-4 py-5 md:grid-cols-[1fr_1fr_2fr] lg:absolute lg:inset-x-0 lg:top-0 lg:grid-cols-[1fr_auto] lg:px-8 lg:py-8"
	>
		<div class="text-lg leading-none tracking-[-0.035em] lg:text-2xl">
			<h1>{project.title}</h1>
		</div>
		<div class="col-start-3 justify-self-end lg:hidden">
			{@render projectMeta(false)}
		</div>
	</header>

	{#if project.poster?.url}
		<figure class="poster-bleed relative w-full overflow-hidden">
			<img
				bind:this={posterImg}
				src={project.poster.url}
				alt={project.poster.alt || ''}
				class="poster-bleed w-full object-cover"
				fetchpriority="high"
			/>
			<div class="pointer-events-none absolute inset-0 hidden lg:block">
				<div class="absolute top-8 right-8" bind:this={inkRoot}>
					{@render projectMeta(true)}
				</div>
			</div>
		</figure>
	{/if}

	<PortableBody value={project.body} stops={project.colorStops} />
</article>
