import { sfx } from '$lib/sfx/palette'
import { unlockAudio } from '$lib/sfx/engine'

type Options = {
	/** Sound on press. Defaults to the tap chirp; `false` for none. */
	click?: 'click' | 'pop' | false
	/** Tone on hover. Fine pointers only. Defaults to on. */
	hover?: boolean
}

/**
 * Adds the site's interface sounds to a button or link. No-ops while sound is
 * off. Hover is only for mouse-like pointers so touch never plays hover tones.
 */
export function sound(node: HTMLElement, options: Options = {}) {
	let opts = options

	const onEnter = (e: PointerEvent) => {
		if (opts.hover === false || e.pointerType !== 'mouse') return
		sfx.hover()
	}
	const onClick = () => {
		unlockAudio()
		if (opts.click === false) return
		if (opts.click === 'pop') sfx.pop()
		else sfx.click()
	}

	node.addEventListener('pointerenter', onEnter)
	node.addEventListener('click', onClick)
	return {
		update(next: Options = {}) {
			opts = next
		},
		destroy() {
			node.removeEventListener('pointerenter', onEnter)
			node.removeEventListener('click', onClick)
		}
	}
}
