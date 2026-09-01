<script lang="ts">
	import ProjectCard from '$lib/components/chrome/ProjectCard.svelte'
	import IconExternal from '$lib/components/ui/IconExternal.svelte'
	import InlineLink from '$lib/components/ui/InlineLink.svelte'
	import LogoMark from '$lib/components/ui/LogoMark.svelte'
	import { viewport } from '$lib/scrollRoot.svelte'
	import type { Credit } from '$lib/sanity/types'
	import type { PageData } from './$types'

	let { data }: { data: PageData } = $props()
	const settings = $derived(data.settings)
	let railH = $state(0)
	const topOffset = $derived(viewport.viewW >= 1024 ? 0 : railH)
	const githubLabel = $derived(settings?.github?.replace(/\/+$/, '').split('/').pop())
	const linkedinLabel = $derived(
		settings?.linkedin
			? `@${settings.linkedin.replace(/\/+$/, '').split('/').pop()}`
			: ''
	)
	const bioParts = $derived.by(() => {
		const bio = settings?.bio
		if (!bio) return [] as string[]
		const split = bio.indexOf('. ')
		if (split === -1) return [bio]
		return [bio.slice(0, split + 1), bio.slice(split + 2)]
	})
	const lists = $derived([
		{ title: 'Experiences', rows: settings?.experiences ?? [], yearCol: false },
		{ title: 'Awards', rows: settings?.awards ?? [], yearCol: true }
	] satisfies { title: string; rows: Credit[]; yearCol: boolean }[])
</script>

<svelte:head>
	<title>{settings?.name ?? 'Portfolio'}</title>
	{#if settings?.bio}
		<meta name="description" content={settings.bio} />
	{/if}
</svelte:head>

<main class="home-shell mx-6 grid grid-flow-dense gap-4 text-chrome-ink lg:grid-cols-9">
	<aside class="home-rail lg:col-span-2" bind:clientHeight={railH}>
		<div class="sticky top-0 flex flex-col pt-8 pb-4 lg:h-screen lg:overflow-y-auto lg:pt-10">
			<div
				class="mb-4 size-6 shrink-0 text-chrome-ink sm:size-7 lg:mb-5 lg:size-5 xl:size-6 2xl:mb-6 2xl:size-7"
				aria-hidden="true"
			>
				<LogoMark />
			</div>
			<div
				class="type-bio flex flex-col gap-[1em] text-[16px] leading-[1.45] font-normal sm:text-[18px] lg:text-[15px] lg:leading-[1.4] xl:text-[18px] 2xl:text-[24px] 2xl:leading-[1.25]"
			>
				<p>{settings?.name}</p>
				{#each bioParts as part}
					<p>{part}</p>
				{/each}
				<div class="flex flex-col items-start gap-2 pl-[0.08em]">
					{#if settings?.email}
						<InlineLink href="mailto:{settings.email}" icon="email">
							{settings.email}
						</InlineLink>
					{/if}
					{#if settings?.linkedin}
						<InlineLink
							href={settings.linkedin}
							icon="linkedin"
							target="_blank"
							rel="noopener noreferrer"
						>
							{linkedinLabel}
						</InlineLink>
					{/if}
					{#if settings?.github}
						<InlineLink href={settings.github} icon="github">{githubLabel}</InlineLink>
					{/if}
				</div>
			</div>

			<div class="mt-8 lg:mt-auto">
				<div class="space-y-6 text-sm opacity-70">
					{#each lists as list}
						<div>
							<p class="mb-[1em] text-[11px] uppercase tracking-[0.12em] lg:text-[10px] 2xl:text-[12px]">{list.title}</p>
							<div class="text-[14px] leading-snug sm:text-[15px] lg:text-[13px] xl:text-[15px] 2xl:text-[18px] 2xl:leading-normal">
								{#each list.rows as row}
									<div
										class="grid gap-x-2 border-b border-current/20 py-1.5 lg:py-1 2xl:py-2 {list.yearCol
											? 'grid-cols-[minmax(0,1fr)_auto]'
											: 'grid-cols-2 gap-x-1'}"
									>
										<div class="font-bold">{row.org}</div>
										<div class="text-right whitespace-nowrap">{row.role}</div>
									</div>
								{/each}
							</div>
						</div>
					{/each}
				</div>

				<footer
					class="mt-10 flex items-baseline justify-between gap-3 text-[14px] leading-snug text-chrome-ink/70 sm:text-[15px] lg:text-[13px] xl:text-[15px] 2xl:text-[18px] 2xl:leading-normal"
				>
					<p>© INGA</p>
					{#if settings?.cv}
						<a
							href={settings.cv}
							target="_blank"
							rel="noopener noreferrer"
							class="inline-flex items-center gap-[0.28em] transition-colors hover:text-[#E08925] focus-visible:text-[#E08925]"
							aria-label="Curriculum Vitae, opens in a new tab"
						>
							Curriculum Vitae
							<span class="inline-flex size-[0.95em] shrink-0"><IconExternal /></span>
						</a>
					{/if}
				</footer>
			</div>
		</div>
	</aside>

	<section class="mb-4 lg:col-span-7">
		<div class="grid w-full grid-cols-1 gap-2 sm:grid-cols-2">
			{#each data.projects as project, i (project._id)}
				<ProjectCard {project} preload={i === 0} index={i} {topOffset} />
			{/each}
		</div>
	</section>
</main>
