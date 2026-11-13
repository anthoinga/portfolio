<script lang="ts">
	import { page } from '$app/state'
	import { pathLang, switchPath } from '$lib/i18n/core'
	import type { Project, SiteSettings } from '$lib/sanity/types'

	let { settings, siteUrl }: { settings: SiteSettings; siteUrl: string } = $props()

	const project = $derived((page.data as { project?: Project }).project)
	const seo = $derived((page.data as { seo?: { title?: string; description?: string } }).seo)
	const pathname = $derived(page.url.pathname)
	const isError = $derived(page.status >= 400)
	const isHome = $derived(!project && !isError && (pathname === '/' || pathname === '/es'))

	function abs(pathOrUrl: string) {
		if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl
		const path = pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`
		return `${siteUrl}${path}`
	}

	const title = $derived.by(() => {
		if (isError) return page.status === 404 ? 'Not found' : 'Error'
		if (project) return project.seoTitle || project.title
		if (seo?.title) return `${seo.title} — ${settings?.name ?? ''}`.replace(/ — $/, '')
		if (isHome && settings?.name) return settings.role ? `${settings.name} — ${settings.role}` : settings.name
		return settings?.name ?? 'Portfolio'
	})

	const description = $derived.by(() => {
		if (isError) return ''
		if (project) return project.seoDescription || project.description || ''
		if (seo?.description) return seo.description
		return settings?.bio ?? ''
	})

	const lang = $derived(pathLang(pathname))
	const canonical = $derived(`${siteUrl}${pathname === '/' ? '/' : pathname}`)
	const alternates = $derived({
		en: `${siteUrl}${switchPath(pathname, 'en')}`,
		es: `${siteUrl}${switchPath(pathname, 'es')}`
	})

	const image = $derived.by(() => {
		if (isError) return ''
		if (project) {
			if (project.hidden) return ''
			const src = project.ogImage?.url || project.poster?.url
			return src ? abs(src) : ''
		}
		if (isHome) return abs('/og/home.png')
		return ''
	})

	const personJson = $derived.by(() => {
		if (!isHome || !settings?.name) return ''
		const sameAs = [settings.linkedin, settings.github].filter(Boolean) as string[]
		const data: Record<string, unknown> = {
			'@context': 'https://schema.org',
			'@type': 'Person',
			name: settings.name,
			url: siteUrl
		}
		if (settings.role) data.jobTitle = settings.role
		if (settings.email) data.email = settings.email
		if (sameAs.length) data.sameAs = sameAs
		return JSON.stringify(data)
	})
</script>

<svelte:head>
	<title>{title}</title>
	{#if description}
		<meta name="description" content={description} />
	{/if}
	{#if isError || project?.hidden}
		<meta name="robots" content="noindex" />
	{/if}
	{#if !isError}
		<link rel="canonical" href={canonical} />
		<link rel="alternate" hreflang="en" href={alternates.en} />
		<link rel="alternate" hreflang="es-PE" href={alternates.es} />
		<link rel="alternate" hreflang="x-default" href={alternates.en} />
		<meta property="og:locale" content={lang === 'es' ? 'es_PE' : 'en_US'} />
		<meta property="og:locale:alternate" content={lang === 'es' ? 'en_US' : 'es_PE'} />
		<meta property="og:url" content={canonical} />
		<meta property="og:type" content="website" />
		<meta property="og:title" content={title} />
		{#if description}
			<meta property="og:description" content={description} />
		{/if}
		{#if image}
			<meta property="og:image" content={image} />
		{/if}
		<meta name="twitter:card" content="summary_large_image" />
		<meta name="twitter:title" content={title} />
		{#if description}
			<meta name="twitter:description" content={description} />
		{/if}
		{#if image}
			<meta name="twitter:image" content={image} />
		{/if}
	{/if}
	{#if personJson}
		{@html `<script type="application/ld+json">${personJson.replace(/</g, '\\u003c')}</script>`}
	{/if}
</svelte:head>
