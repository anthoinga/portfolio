export const cursorNotice = $state({ copied: false })

let copiedTimer: ReturnType<typeof setTimeout> | undefined

export function flashCopied(ms = 1600) {
	cursorNotice.copied = true
	clearTimeout(copiedTimer)
	copiedTimer = setTimeout(() => {
		cursorNotice.copied = false
	}, ms)
}
