import { writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const root = join(dirname(fileURLToPath(import.meta.url)), '../static/posters')
const input = join(root, 'field.jpg')
const output = join(root, 'field.png')

const { data, info } = await sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
const { width: w, height: h } = info

const isBg = (i) => {
	const r = data[i]
	const g = data[i + 1]
	const b = data[i + 2]
	return r <= 28 && g <= 28 && b <= 28
}

const visited = new Uint8Array(w * h)
const queue = []

const push = (x, y) => {
	if (x < 0 || y < 0 || x >= w || y >= h) return
	const idx = y * w + x
	if (visited[idx]) return
	if (!isBg(idx * 4)) return
	visited[idx] = 1
	queue.push(idx)
}

for (let x = 0; x < w; x++) {
	push(x, 0)
	push(x, h - 1)
}
for (let y = 0; y < h; y++) {
	push(0, y)
	push(w - 1, y)
}

while (queue.length) {
	const idx = queue.pop()
	const x = idx % w
	const y = (idx / w) | 0
	push(x - 1, y)
	push(x + 1, y)
	push(x, y - 1)
	push(x, y + 1)
}

for (let idx = 0; idx < w * h; idx++) {
	if (!visited[idx]) continue
	data[idx * 4 + 3] = 0
}

await sharp(data, { raw: { width: w, height: h, channels: 4 } }).png().toFile(output)
console.log(`wrote ${output}`)
