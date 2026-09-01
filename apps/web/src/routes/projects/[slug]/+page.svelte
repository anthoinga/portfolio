<script lang="ts">
	import PortableBody from '$lib/components/content/PortableBody.svelte'
	import NextProjectCTA from '$lib/components/chrome/NextProjectCTA.svelte'
	import { createProjectMotion } from '$lib/projectHandoff.svelte'
	import { projectCssVars, projectSurface } from '$lib/theme'
	import type { PageData } from './$types'

	let { data }: { data: PageData } = $props()
	const project = $derived(data.project)
	const surface = $derived(projectSurface(project))
	const motion = createProjectMotion(() => project)
</script>

<svelte:head>
	<title>{project.seoTitle || project.title}</title>
	<meta name="description" content={project.seoDescription || project.description || ''} />
	<!-- /projects is tabled; keep the route, hide it from search. -->
	<meta name="robots" content="noindex" />
	{#if project.ogImage?.url || project.poster?.url}
		<meta property="og:image" content={project.ogImage?.url || project.poster?.url} />
	{/if}
	<meta property="og:title" content={project.seoTitle || project.title} />
	<meta property="og:description" content={project.seoDescription || project.description || ''} />
</svelte:head>

<article
	bind:clientHeight={motion.articleHeight}
	class="project-article relative z-10 overflow-hidden rounded-card pb-24"
	data-type={project.type}
	style="{projectCssVars(project)}; background-color:{surface.background}; color:{surface.color}; transform:translate3d({motion.articleX}px, {motion.articleY}px, 0) scale({motion.articleScale}); opacity:{motion.articleOpacity}; transform-origin:{motion.transformOrigin}; transition:{motion.articleTransition}; will-change:transform, opacity;"
>
	<header
		class="relative z-20 grid grid-cols-[1fr_1fr_4fr] gap-4 px-4 py-5 md:grid-cols-[1fr_1fr_2fr] lg:absolute lg:inset-x-0 lg:top-0 lg:grid-cols-[2fr_1fr] lg:px-8 lg:py-8"
	>
		<div class="text-lg leading-none tracking-[-0.035em] lg:text-2xl">
			<h1>{project.title}</h1>
		</div>
		<div class="col-start-3 text-sm leading-tight lg:col-start-2 lg:text-base">
			{#if project.description}
				<p class="max-w-[32ch] text-lg leading-[1.12] tracking-[-0.018em] lg:text-2xl">{project.description}</p>
			{/if}
			{#if project.scope}
				<p class="mt-4 opacity-50 lg:mt-8">{project.scope}</p>
			{/if}
			<div class="mt-4 opacity-50 lg:mt-6">
				{#each project.tags as tag}<div>{tag}</div>{/each}
			</div>
		</div>
	</header>

	{#if project.poster?.url}
		<figure class="poster-bleed w-full overflow-hidden">
			<img
				src={project.poster.url}
				alt={project.poster.alt || ''}
				class="poster-bleed w-full object-cover"
				fetchpriority="high"
			/>
		</figure>
	{/if}

	<PortableBody value={project.body} />
</article>

{#if project.nextProject}
	<div
		bind:this={motion.nextStage}
		class="mt-6 h-72"
		style="transform: translateY({motion.down * -100}px) scale({motion.targetScale}); transform-origin: center top;"
	>
		<NextProjectCTA next={project.nextProject} />
	</div>
{/if}
