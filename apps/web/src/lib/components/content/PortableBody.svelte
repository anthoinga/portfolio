<script lang="ts">
	import { PortableText } from '@portabletext/svelte'
	import FullImage from './FullImage.svelte'
	import LayoutBlock from './LayoutBlock.svelte'
	import Video from './Video.svelte'
	import Team from './Team.svelte'
	import List from './List.svelte'
	import Quote from './Quote.svelte'
	import SlideShow from './SlideShow.svelte'
	import Spacer from './Spacer.svelte'
	import Block from './Block.svelte'
	import Heading from './Heading.svelte'
	import type { PortableBlock } from '$lib/sanity/types'

	let { value }: { value: PortableBlock[] } = $props()

	const components = {
		block: {
			normal: Block,
			h2: Heading,
			h3: Heading
		},
		types: {
			fullImage: FullImage,
			layoutBlock: LayoutBlock,
			videoBlock: Video,
			team: Team,
			listBlock: List,
			quoteBlock: Quote,
			slideShow: SlideShow,
			spacer: Spacer
		}
	}

	const blocks = $derived(
		value.filter((block) => block._type === 'block' || block._type in components.types)
	)
</script>

<div class="portable grid grid-cols-6 gap-x-4 px-6 pt-24 text-base tracking-[-0.016em] md:text-xl lg:pt-0 2xl:px-16">
	<PortableText value={blocks} {components} />
</div>
