import { cardMetrics, type CardMetrics } from './scroll'

export const viewport = $state({
	scrollY: 0,
	viewW: typeof window === 'undefined' ? 1280 : window.innerWidth,
	viewH: typeof window === 'undefined' ? 800 : window.innerHeight,
	scroller: null as HTMLElement | null
})

export function metrics(): CardMetrics {
	return cardMetrics(viewport.viewW, viewport.viewH)
}

export function bindScroller(node: HTMLElement) {
	viewport.scroller = node
	const onScroll = () => {
		viewport.scrollY = node.scrollTop
	}
	const onResize = () => {
		viewport.viewW = window.innerWidth
		viewport.viewH = window.innerHeight
	}
	onScroll()
	onResize()
	node.addEventListener('scroll', onScroll, { passive: true })
	window.addEventListener('resize', onResize)
	return {
		destroy() {
			node.removeEventListener('scroll', onScroll)
			window.removeEventListener('resize', onResize)
			if (viewport.scroller === node) viewport.scroller = null
		}
	}
}
