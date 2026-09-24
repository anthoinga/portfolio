export type GalagaEls = {
	root: HTMLElement
	stage: HTMLElement
	screen: HTMLElement
	canvas: HTMLCanvasElement
	glow: HTMLCanvasElement
	glow2: HTMLCanvasElement
	bg: HTMLCanvasElement
	edge: HTMLElement
	flash: HTMLElement
	pad: HTMLElement
	onTitleChange: (onTitle: boolean) => void
}

export function mountGalaga(els: GalagaEls) {
	const COLS = 60,
		ROWS = 36
	const FAMILY = 'Inconsolata, ui-monospace, monospace'
	const { root, stage, screen: screenEl, canvas, glow: glowCv, glow2: glow2Cv, bg: bgCv, edge: edgeEl, flash: flashEl, pad } =
		els
	const ctx = canvas.getContext('2d')!
	const gctx = glowCv.getContext('2d')!
	const g2ctx = glow2Cv.getContext('2d')!
	const bctx = bgCv.getContext('2d')!
	let ASP = 0.5,
		glow2Base = 0.8,
		glow2Shown = -1,
		glow1Base = 1,
		glow1Shown = -1,
		glowMul = 0
	let cw = 10,
		chH = 16,
		fontPx = 16,
		glyphPx = 14
	const GLYPH_SCALE = 0.58
	const CELL_TRACK = 0.92 // pull columns closer without changing row height / canvas height
	const WEIGHT = 900
	const WEIGHT_BOLD = 900
	const SHIP_LH = 0.62 // tighter vertical spacing for the hero ship sprite

	const C: Record<string, string | boolean> = {}
	const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches

	function setFont(k: CanvasRenderingContext2D, px: number, weight = WEIGHT) {
		k.font = `${weight} ${px}px ${FAMILY}`
		// Variable fonts on canvas ignore font-weight unless wght is set explicitly.
		k.fontVariationSettings = `'wght' ${weight}`
	}

	function readColors() {
		const s = getComputedStyle(root)
		C.dark = s.getPropertyValue('--blend').trim() === 'screen'
		C.hot = s.getPropertyValue('--hot').trim()
		for (const k of [
			'ink',
			'dim',
			'ship',
			'bee',
			'fly',
			'boss',
			'hurt',
			'shot',
			'hull',
			'red',
			'm0',
			'm1',
			'm2',
			'm3',
			'r0',
			'r1',
			'r2',
			'r3'
		])
			C[k] = s.getPropertyValue('--' + k).trim()
	}

	function resize() {
		const st = getComputedStyle(stage)
		const W = Math.max(
			1,
			stage.clientWidth - parseFloat(st.paddingLeft) - parseFloat(st.paddingRight)
		)
		const H = Math.max(
			1,
			stage.clientHeight - parseFloat(st.paddingTop) - parseFloat(st.paddingBottom)
		)
		ctx.font = `100px ${FAMILY}`
		const ratio = ctx.measureText('M').width / 100 || 0.5
		// Fill the stage exactly; cell aspect follows the viewport so glyphs scale with it.
		cw = W / COLS
		chH = H / ROWS
		fontPx = Math.max(8, Math.min(chH, cw / (ratio * CELL_TRACK)))
		glyphPx = Math.max(7, Math.round(fontPx * GLYPH_SCALE))
		const dpr = window.devicePixelRatio || 1
		canvas.style.width = W + 'px'
		canvas.style.height = H + 'px'
		canvas.width = Math.round(W * dpr)
		canvas.height = Math.round(H * dpr)
		glowCv.style.width = W + 'px'
		glowCv.style.height = H + 'px'
		glowCv.width = Math.ceil(canvas.width / 2)
		glowCv.height = Math.ceil(canvas.height / 2)
		glowCv.style.filter = `blur(${Math.max(2, fontPx * 0.3).toFixed(1)}px) saturate(2) brightness(2)`
		glow2Cv.style.width = W + 'px'
		glow2Cv.style.height = H + 'px'
		glow2Cv.width = Math.ceil(canvas.width / 4)
		glow2Cv.height = Math.ceil(canvas.height / 4)
		glow2Cv.style.filter = `blur(${Math.max(6, fontPx * 1.3).toFixed(1)}px) saturate(2.4) brightness(2.6)`
		ASP = cw / chH
		glow2Base = parseFloat(getComputedStyle(root).getPropertyValue('--glow2-op')) || 0.8
		glow2Shown = -1
		glow1Base = parseFloat(getComputedStyle(root).getPropertyValue('--glow-op')) || 1
		glow1Shown = -1
		ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
		readColors()
		initRain(dpr)
	}

	const gChar = new Array(COLS * ROWS),
		gCol = new Array(COLS * ROWS),
		gLay = new Uint8Array(COLS * ROWS)
	let layer = 1
	function clearGrid() {
		gChar.fill(' ')
		gCol.fill(null)
		gLay.fill(0)
	}
	function put(x: number, y: number, c: string, col: string) {
		x = Math.round(x)
		y = Math.round(y)
		if (c === ' ' || x < 0 || y < 0 || x >= COLS || y >= ROWS) return
		gChar[y * COLS + x] = c
		gCol[y * COLS + x] = col
		gLay[y * COLS + x] = layer
	}
	function text(s: string, x: number, y: number, col: string) {
		for (let i = 0; i < s.length; i++) put(x + i, y, s[i], col)
	}
	function ctext(s: string, y: number, col: string) {
		text(s, Math.floor((COLS - s.length) / 2), y, col)
	}

	const PLAYER = ['   ^   ', '|i/0\\i|', ' —/-\\— ']
	const PLAYER_ROWS = 3
	const HIT_HALF = [0.8, 3.2, 2.2]

	function sprite(lines: string[], cx: number, ty: number, col: string) {
		const w = lines[0].length,
			left = Math.round(cx) - Math.floor(w / 2),
			top = Math.round(ty)
		for (let r = 0; r < lines.length; r++)
			for (let i = -1; i <= w; i++) {
				const x = left + i,
					y = top + r
				maskRain(x, y)
				if (i < 0 || i >= w) continue
				put(x, y, lines[r][i], col)
			}
	}

	type ShipDraw = { cx: number; ty: number; tipRed: boolean }
	let shipDraws: ShipDraw[] = []
	function queueShip(cx: number, ty: number, tipRed = false) {
		const w = PLAYER[0].length
		const left = Math.round(cx) - Math.floor(w / 2)
		for (let r = 0; r < PLAYER.length; r++) {
			const yy = ty + r * SHIP_LH
			for (let i = -1; i <= w; i++) maskRain(left + i, Math.round(yy))
		}
		shipDraws.push({ cx, ty, tipRed })
	}
	function drawShips(k: CanvasRenderingContext2D) {
		if (!shipDraws.length) return
		k.textAlign = 'center'
		k.textBaseline = 'middle'
		setFont(k, glyphPx)
		for (const s of shipDraws) {
			const w = PLAYER[0].length
			const left = Math.round(s.cx) - Math.floor(w / 2)
			for (let r = 0; r < PLAYER.length; r++) {
				for (let i = 0; i < w; i++) {
					const ch = PLAYER[r][i]
					if (ch === ' ') continue
					const tip = s.tipRed && r === 0 && ch === '^'
					k.fillStyle = (C[tip ? 'red' : 'hull'] as string) || (tip ? 'red' : 'hull')
					k.fillText(ch, PX(left + i), PY(s.ty + r * SHIP_LH))
				}
			}
		}
		shipDraws = []
	}

	function draw() {
		const dpr = window.devicePixelRatio || 1
		const sx = (Math.random() * 2 - 1) * shake * cw,
			sy = (Math.random() * 2 - 1) * shake * cw
		if (state === 'title') {
			bctx.setTransform(1, 0, 0, 1, 0, 0)
			bctx.clearRect(0, 0, bgCv.width, bgCv.height)
		} else
			drawRain(
				dpr,
				sx * 0.35,
				sy * 0.35,
				state === 'boot' ? beamRow() : state === 'shut' ? shutBeamRow() : Infinity
			)
		for (const [k, L] of [[ctx, 1] as const]) {
			k.setTransform(dpr, 0, 0, dpr, 0, 0)
			k.clearRect(0, 0, cw * COLS, chH * ROWS)
			k.setTransform(dpr, 0, 0, dpr, sx * dpr, sy * dpr)
			setFont(k, glyphPx)
			k.textAlign = 'center'
			k.textBaseline = 'middle'
			let last: string | null = null
			for (let y = 0; y < ROWS; y++)
				for (let x = 0; x < COLS; x++) {
					const i = y * COLS + x,
						c = gChar[i]
					if (c === ' ' || gLay[i] !== L) continue
					if (gCol[i] !== last) {
						last = gCol[i]
						k.fillStyle = (C[last!] as string) || last!
					}
					k.fillText(c, x * cw + cw / 2, y * chH + chH / 2 + fontPx * 0.04)
				}
		}
		drawShips(ctx)
		drawFx(ctx)
		gctx.clearRect(0, 0, glowCv.width, glowCv.height)
		gctx.drawImage(canvas, 0, 0, glowCv.width, glowCv.height)
		g2ctx.clearRect(0, 0, glow2Cv.width, glow2Cv.height)
		g2ctx.drawImage(canvas, 0, 0, glow2Cv.width, glow2Cv.height)
		const op = Math.min(1, glow2Base * (1 + bloom * 0.9)) * glowMul
		if (Math.abs(op - glow2Shown) > 0.02 || (op === 0 && glow2Shown !== 0)) {
			glow2Shown = op
			glow2Cv.style.opacity = op.toFixed(2)
		}
		const op1 = glow1Base * Math.min(1, glowMul * 1.4)
		if (Math.abs(op1 - glow1Shown) > 0.02 || (op1 === 0 && glow1Shown !== 0)) {
			glow1Shown = op1
			glowCv.style.opacity = op1.toFixed(2)
		}
	}

	const PX = (x: number) => x * cw + cw / 2,
		PY = (y: number) => y * chH + chH / 2
	function drawFx(k: CanvasRenderingContext2D) {
		if (!parts) return
		k.save()
		k.textAlign = 'center'
		k.textBaseline = 'middle'
		if (C.dark) k.globalCompositeOperation = 'lighter'
		const F = glyphPx
		for (const b of pBul) {
			for (let j = 3; j >= 1; j--) {
				k.globalAlpha = 0.5 / j
				k.fillStyle = C.red as string
				setFont(k, F)
				k.fillText('|', PX(b.x), PY(b.y + j * 0.55))
			}
			k.globalAlpha = 1
			k.fillStyle = C.red as string
			setFont(k, F, WEIGHT_BOLD)
			k.fillText('|', PX(b.x), PY(b.y))
		}
		for (const b of eBul) {
			k.globalAlpha = 0.35
			k.fillStyle = C.shot as string
			setFont(k, F)
			k.fillText('.', PX(b.x - b.vx * 0.04), PY(b.y - 0.8))
			k.globalAlpha = 1
			setFont(k, F * 1.1, WEIGHT_BOLD)
			k.save()
			k.translate(PX(b.x), PY(b.y))
			k.rotate(t * 9)
			k.fillText('*', 0, 0)
			k.restore()
		}
		for (const p of parts) {
			const f = Math.max(0, p.life / p.max),
				col = (C[p.col] as string) || p.col
			if (p.k === 'flash') {
				const R = p.size * cw * (1.2 - f * 0.4)
				const g = k.createRadialGradient(PX(p.x), PY(p.y), 0, PX(p.x), PY(p.y), R)
				g.addColorStop(0, C.hot as string)
				g.addColorStop(0.25, col)
				g.addColorStop(1, 'rgba(0,0,0,0)')
				k.globalAlpha = f * f * (C.dark ? 1 : 0.5)
				k.fillStyle = g
				k.beginPath()
				k.arc(PX(p.x), PY(p.y), R, 0, Math.PI * 2)
				k.fill()
			} else if (p.k === 'ring') {
				const e = 1 - Math.pow(f, 2.2),
					R = e * p.size * cw
				const n = p.n!,
					ch = f > 0.5 ? 'o' : f > 0.25 ? '*' : '.'
				k.globalAlpha = f
				k.fillStyle = f > 0.7 ? (C.hot as string) : col
				setFont(k, F * (0.6 + f * 0.5), WEIGHT_BOLD)
				for (let i = 0; i < n; i++) {
					const a = (i / n) * Math.PI * 2 + p.rot!
					k.fillText(ch, PX(p.x) + Math.cos(a) * R, PY(p.y) + Math.sin(a) * R * 0.75)
				}
			} else if (p.k === 'spark') {
				k.fillStyle = col
				for (let j = 0; j < p.trail!.length; j++) {
					const q = p.trail![j]
					k.globalAlpha = f * (1 - (j + 1) / (p.trail!.length + 1)) * 0.8
					setFont(k, F * 0.55 * (1 - j * 0.12))
					k.fillText('.', PX(q.x), PY(q.y))
				}
				k.globalAlpha = Math.min(1, f * 1.4)
				k.fillStyle = f > 0.55 ? (C.hot as string) : col
				setFont(k, F * (0.45 + f * 0.6), WEIGHT_BOLD)
				k.fillText(f > 0.6 ? '*' : f > 0.3 ? '+' : '.', PX(p.x), PY(p.y))
			} else if (p.k === 'ember') {
				k.globalAlpha = f * (0.6 + 0.4 * Math.sin(p.life * 30 + p.rot!))
				k.fillStyle = f > 0.7 ? (C.hot as string) : col
				setFont(k, F * 0.8)
				k.fillText(p.ch!, PX(p.x), PY(p.y))
			} else if (p.k === 'debris') {
				k.globalAlpha = Math.min(1, f * 1.6)
				k.fillStyle = f > 0.8 ? (C.hot as string) : col
				setFont(k, F * (0.7 + f * 0.4), WEIGHT_BOLD)
				k.save()
				k.translate(PX(p.x), PY(p.y))
				k.rotate(p.rot!)
				k.fillText(p.ch!, 0, 0)
				k.restore()
			}
		}
		k.restore()
	}

	function hitsPlayer(x: number, y: number) {
		const r = y - player.y
		if (r < -0.4 || r > PLAYER_ROWS - 0.5) return false
		return Math.abs(x - player.x) <= HIT_HALF[clamp(Math.round(r), 0, PLAYER_ROWS - 1)]
	}
	const TYPES: Record<
		string,
		{ f: string[]; col: string; pts: number[]; hp: number; hurt?: string[] }
	> = {
		bee: { f: ['}o{', '{o}'], col: 'bee', pts: [50, 100], hp: 1 },
		fly: { f: ['>W<', '<W>'], col: 'fly', pts: [80, 160], hp: 1 },
		boss: { f: ['[@]', ']@['], hurt: ['(@)', ')@('], col: 'boss', pts: [150, 400], hp: 2 }
	}
	function layoutClassic() {
		const s: { col: number; row: number }[] = []
		for (let c = 4; c <= 6; c++) s.push({ col: c, row: 0 })
		for (let r = 1; r <= 2; r++) for (let c = 2; c <= 8; c++) s.push({ col: c, row: r })
		for (let r = 3; r <= 4; r++) for (let c = 1; c <= 9; c++) s.push({ col: c, row: r })
		return s
	}
	const typeForRow = (r: number) => (r === 0 ? 'boss' : r <= 2 ? 'fly' : 'bee')

	type Pt = { x: number; y: number }
	type Bullet = { x: number; y: number; py?: number; vx?: number; vy?: number; hit?: boolean }
	type Enemy = {
		type: string
		slot: { col: number; row: number }
		hp: number
		alive: boolean
		x: number
		y: number
		state: string
		delay: number
		t: number
		dur: number
		phase: number
		path: (Pt | null)[]
		shots?: number[]
		shotI?: number
	}
	type Part = {
		k: string
		x: number
		y: number
		size?: number
		life: number
		max: number
		col: string
		vx?: number
		vy?: number
		drag?: number
		g?: number
		bounce?: number
		rot?: number
		vr?: number
		n?: number
		ch?: string
		trail?: Pt[]
	}
	type Pop = { x: number; y: number; s: string; life: number }
	type Player = { x: number; y: number; dead: boolean; respawn: number; inv: number }

	let overT = 0
	let state = 'title',
		t = 0,
		score = 0,
		lives = 2,
		wave = 0
	let hi = 0
	try {
		hi = parseInt(localStorage.getItem('galaga404-hi') || '0', 10) || 0
	} catch {
		/* */
	}
	function saveHi() {
		if (score > hi) {
			hi = score
			try {
				localStorage.setItem('galaga404-hi', String(hi))
			} catch {
				/* */
			}
		}
	}

	let player: Player,
		pBul: Bullet[],
		eBul: (Bullet & { vx: number; vy: number })[],
		enemies: Enemy[],
		parts: Part[],
		pops: Pop[],
		msg = '',
		msgT = 0,
		diveT = 0,
		clearT = 0,
		fireCd = 0,
		formT = 0,
		gunSide = 1
	const GUN_OFFSET = 3
	const keys = { left: false, right: false, fire: false }
	const GLYPHS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ$#%&@*+=<>/\\|{}[]:;?!~'
	const rndGlyph = () => GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
	let RC = COLS,
		RR = ROWS,
		rOX = 0,
		rOY = 0,
		rSX = 0,
		rSY = 0,
		bgW = 0,
		bgH = 0
	let mGrid: string[] = [],
		rMask = new Uint8Array(0),
		drops: ({ y: number; v: number; len: number } | null)[] = []

	function setState(s: string) {
		state = s
		els.onTitleChange(s === 'title')
	}

	function newDrop(initial: boolean) {
		return {
			y: initial ? Math.random() * RR * 1.5 - RR * 0.5 : -Math.random() * RR * 0.8,
			v: 5 + Math.random() * 11,
			len: 5 + Math.floor(Math.random() * 14)
		}
	}
	function initRain(dpr: number) {
		bgW = window.innerWidth
		bgH = window.innerHeight
		const r = canvas.getBoundingClientRect()
		rOX = Math.ceil(r.left / cw)
		rOY = Math.ceil(r.top / chH)
		rSX = r.left - rOX * cw
		rSY = r.top - rOY * chH
		RC = rOX + Math.ceil((bgW - r.left) / cw) + 1
		RR = rOY + Math.ceil((bgH - r.top) / chH) + 1
		mGrid = Array.from({ length: RC * RR }, rndGlyph)
		rMask = new Uint8Array(RC * RR)
		drops = Array.from({ length: RC }, () => (Math.random() < 0.7 ? newDrop(true) : null))
		bgCv.style.width = bgW + 'px'
		bgCv.style.height = bgH + 'px'
		bgCv.width = Math.round(bgW * dpr)
		bgCv.height = Math.round(bgH * dpr)
	}
	function maskRain(gx: number, gy: number) {
		const x = gx + rOX,
			y = gy + rOY
		if (x >= 0 && y >= 0 && x < RC && y < RR) rMask[y * RC + x] = 1
	}
	function drawRain(dpr: number, ox: number, oy: number, reveal = Infinity) {
		bctx.setTransform(dpr, 0, 0, dpr, 0, 0)
		bctx.clearRect(0, 0, bgW, bgH)
		bctx.setTransform(dpr, 0, 0, dpr, ox * dpr, oy * dpr)
		setFont(bctx, glyphPx)
		bctx.textAlign = 'center'
		bctx.textBaseline = 'middle'
		const pal =
			hurtFx > 0 && (hurtFx > 0.35 || Math.floor(t * 20) % 2)
				? ['r0', 'r1', 'r2', 'r3']
				: ['m0', 'm1', 'm2', 'm3']
		let last: string | null = null
		for (let x = 0; x < RC; x++) {
			const d = drops[x]
			if (!d) continue
			const head = Math.floor(d.y)
			for (let k = 0; k < d.len; k++) {
				const y = head - k
				if (y < 0 || y >= RR || y >= reveal) continue
				const i = y * RC + x
				if (rMask[i]) continue
				const f = k / d.len,
					col = k === 0 ? pal[0] : f < 0.3 ? pal[1] : f < 0.65 ? pal[2] : pal[3]
				if (col !== last) {
					last = col
					bctx.fillStyle = C[col] as string
				}
				bctx.fillText(mGrid[i], rSX + x * cw + cw / 2, rSY + y * chH + chH / 2 + fontPx * 0.04)
			}
		}
		if (reveal !== Infinity && reveal > 0 && reveal < RR + 1) drawBeam(reveal)
	}
	function drawBeam(row: number) {
		const y = rSY + row * chH
		bctx.save()
		const band = bctx.createLinearGradient(0, y - chH * 4, 0, y)
		band.addColorStop(0, 'rgba(0,0,0,0)')
		band.addColorStop(1, C.m1 as string)
		bctx.globalAlpha = 0.55
		bctx.fillStyle = band
		bctx.fillRect(0, y - chH * 4, bgW, chH * 4)
		bctx.globalAlpha = 0.85
		bctx.fillStyle = C.hot as string
		const r = Math.floor(row)
		for (let x = 0; x < RC; x++)
			if (Math.random() < 0.5) bctx.fillText(rndGlyph(), rSX + x * cw + cw / 2, rSY + r * chH + chH / 2)
		bctx.restore()
	}
	let hurtFx = 0

	const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v))
	const formX = () => Math.sin(formT * 0.8) * 3
	const slotPos = (s: { col: number; row: number }) => ({ x: 10 + s.col * 4 + formX(), y: 4 + s.row * 2 })
	function bez(P: Pt[], u: number) {
		const a = 1 - u
		return {
			x: a * a * a * P[0].x + 3 * a * a * u * P[1].x + 3 * a * u * u * P[2].x + u * u * u * P[3].x,
			y: a * a * a * P[0].y + 3 * a * a * u * P[1].y + 3 * a * u * u * P[2].y + u * u * u * P[3].y
		}
	}

	function startGame() {
		score = 0
		lives = 2
		wave = 0
		player = { x: COLS / 2, y: ROWS - 1 - PLAYER_ROWS - 1, dead: false, respawn: 0, inv: 0 }
		pBul = []
		eBul = []
		parts = []
		pops = []
		enemies = []
		nextWave()
		setState('play')
	}
	function nextWave() {
		wave++
		const slots = layoutClassic()
		const speed = 1 + wave * 0.05
		enemies = slots.map((s, i) => {
			const group = Math.floor(i / 5),
				side = group % 2 ? 1 : -1
			const type = typeForRow(s.row)
			return {
				type,
				slot: s,
				hp: TYPES[type].hp,
				alive: true,
				x: -10,
				y: -10,
				state: 'wait',
				delay: 1.4 + group * 0.85 + (i % 5) * 0.13,
				t: 0,
				dur: 2.4 / speed,
				phase: Math.random() * 2,
				path: [
					{ x: side < 0 ? -3 : COLS + 2, y: 3 },
					{ x: COLS / 2 - side * 14, y: 29 },
					{ x: COLS / 2 + side * 16, y: 17 },
					null
				]
			}
		})
		msg = wave === 1 ? 'READY' : `WAVE ${wave}`
		msgT = 2
		diveT = 2.5
		eBul = []
	}
	function startDive(e: Enemy, off = 0) {
		const dir = e.x < COLS / 2 ? -1 : 1
		const tx = clamp(player.x + (Math.random() * 8 - 4), 6, COLS - 7)
		e.path = [
			{ x: e.x, y: e.y },
			{ x: e.x + dir * 9, y: e.y - 6 },
			{ x: tx - dir * 8 + off * 4, y: ROWS * 0.72 },
			{ x: tx + dir * 6 + off * 4, y: ROWS + 3 }
		]
		e.state = 'dive'
		e.t = 0
		e.dur = 3.0 / (1 + wave * 0.07)
		e.shots = [0.36 + Math.random() * 0.1, 0.54 + Math.random() * 0.1].filter(
			() => Math.random() < 0.5 + wave * 0.07
		)
		e.shotI = 0
	}
	let shake = 0,
		bloom = 0,
		freeze = 0
	function rnd(a: number, b: number) {
		return a + Math.random() * (b - a)
	}
	function explode(x: number, y: number, col: string, power = 1, glyphs = '') {
		const P = power
		parts.push({ k: 'flash', x, y, size: 4 + 4 * P, life: 0.22 + 0.1 * P, max: 0.22 + 0.1 * P, col })
		const nS = Math.round(26 * P)
		for (let i = 0; i < nS; i++) {
			const up = Math.random() < 0.75
			const a = up ? -Math.PI / 2 + rnd(-1.25, 1.25) : Math.random() * Math.PI * 2
			const v = Math.pow(Math.random(), 0.6) * rnd(10, 30) * Math.sqrt(P)
			const life = rnd(0.9, 1.8)
			parts.push({
				k: 'spark',
				x: x + rnd(-0.8, 0.8),
				y: y + rnd(-0.3, 0.3),
				vx: Math.cos(a) * v,
				vy: Math.sin(a) * v * ASP * 1.6,
				drag: rnd(0.3, 0.9),
				g: rnd(22, 38),
				bounce: rnd(0.25, 0.45),
				life,
				max: life,
				col: Math.random() < 0.2 ? 'hot' : col,
				trail: []
			})
		}
		const nE = Math.round(10 * P)
		for (let i = 0; i < nE; i++) {
			const a = Math.random() * Math.PI * 2,
				v = rnd(2, 9),
				life = rnd(0.8, 1.8)
			parts.push({
				k: 'ember',
				x,
				y,
				vx: Math.cos(a) * v,
				vy: Math.sin(a) * v * ASP - 2,
				drag: 1.4,
				g: 5,
				life,
				max: life,
				col,
				ch: Math.random() < 0.5 ? '.' : "'",
				rot: Math.random() * 6
			})
		}
		for (const ch of glyphs) {
			if (ch === ' ') continue
			const a = Math.random() * Math.PI * 2,
				v = rnd(6, 16),
				life = rnd(0.7, 1.2)
			parts.push({
				k: 'debris',
				x: x + rnd(-1, 1),
				y,
				vx: Math.cos(a) * v * 0.7,
				vy: -rnd(4, 12),
				drag: 0.4,
				g: 34,
				bounce: 0.3,
				vr: rnd(-12, 12),
				rot: 0,
				life,
				max: life,
				col,
				ch
			})
		}
		shake = Math.max(shake, 0.25 * P)
		bloom = Math.min(1.5, bloom + 0.35 * P)
	}
	function sparkBurst(x: number, y: number, col: string, n = 8, dirY = 0) {
		for (let i = 0; i < n; i++) {
			const a = dirY ? (-Math.PI / 2) * dirY + rnd(-1, 1) : Math.random() * Math.PI * 2,
				v = rnd(8, 24),
				life = rnd(0.15, 0.4)
			parts.push({
				k: 'spark',
				x,
				y,
				vx: Math.cos(a) * v,
				vy: Math.sin(a) * v * ASP,
				drag: 5,
				g: 0,
				life,
				max: life,
				col,
				trail: []
			})
		}
	}
	function updateFx(dt: number) {
		shake = Math.max(0, shake - dt * 1.6)
		bloom = Math.max(0, bloom - dt * 1.8)
		if (!parts) return
		for (const p of parts) {
			p.life -= dt
			if (p.vx === undefined) continue
			if (p.trail) {
				p.trail.unshift({ x: p.x, y: p.y })
				if (p.trail.length > 7) p.trail.pop()
			}
			const d = Math.exp(-(p.drag ?? 0) * dt)
			p.vx *= d
			p.vy! *= d
			p.vy! += (p.g ?? 0) * dt
			p.x += p.vx * dt
			p.y += p.vy! * dt
			if (p.bounce && p.y > ROWS - 1.4 && p.vy! > 0) {
				p.y = ROWS - 1.4
				p.vy! *= -p.bounce
				p.vx *= 0.55
				if (p.vy! > -1.5) {
					p.vy = 0
					p.g = 0
					p.drag = 4
				}
			}
			if (p.vr) p.rot = (p.rot ?? 0) + p.vr * dt
		}
		parts = parts.filter((p) => p.life > 0)
		for (const p of pops) {
			p.y -= 3 * dt
			p.life -= dt
		}
		pops = pops.filter((p) => p.life > 0)
	}
	function killEnemy(e: Enemy) {
		e.alive = false
		const diving = e.state !== 'form'
		const pts = TYPES[e.type].pts[diving ? 1 : 0]
		score += pts
		saveHi()
		const T = TYPES[e.type]
		explode(e.x, e.y, T.col, e.type === 'boss' ? 1.8 : diving ? 1.2 : 1, T.f[0])
		freeze = Math.max(freeze, e.type === 'boss' ? 0.07 : 0.035)
		if (diving) pops.push({ x: e.x, y: e.y, s: String(pts), life: 0.9 })
	}
	function killPlayer() {
		player.dead = true
		player.respawn = 2.2
		explode(player.x, player.y + 1, 'red', 2.6, PLAYER.join(''))
		explode(player.x, player.y + 1, 'ship', 1.2)
		shake = 1.2
		freeze = 0.14
		eBul = []
		damageFx()
	}
	function retrigger(el: HTMLElement, cls: string) {
		el.classList.remove(cls)
		void el.offsetWidth
		el.classList.add(cls)
	}
	function damageFx() {
		hurtFx = 1.1
		retrigger(edgeEl, 'hit')
		retrigger(flashEl, 'hit')
		if (!reduceMotion) retrigger(screenEl, 'shake')
		for (let i = 0; i < mGrid.length; i++) if (Math.random() < 0.5) mGrid[i] = rndGlyph()
	}
	let lowOn = false
	function updateEdge() {
		const low = state === 'play' && lives === 0 && !player.dead
		if (low !== lowOn) {
			lowOn = low
			edgeEl.classList.toggle('low', low)
		}
	}
	const onAnimEnd = (e: AnimationEvent) => {
		const el = e.currentTarget as HTMLElement
		const name = e.animationName
		if (name.includes('edgeHit') || name.includes('flashHit')) el.classList.remove('hit')
		if (name.includes('shake')) el.classList.remove('shake')
	}
	;[edgeEl, flashEl, screenEl].forEach((el) => el.addEventListener('animationend', onAnimEnd))

	function update(dt: number) {
		hurtFx = Math.max(0, hurtFx - dt)
		const mSpeed = (reduceMotion ? 0.25 : 1) * (1 + hurtFx * 2.5)
		for (let x = 0; x < RC; x++) {
			const d = drops[x]
			if (!d) {
				if (Math.random() < dt * 0.6) drops[x] = newDrop(false)
				continue
			}
			d.y += d.v * dt * mSpeed
			if (d.y - d.len > RR) drops[x] = Math.random() < 0.75 ? newDrop(false) : null
		}
		const flips = Math.floor(RC * RR * dt * (0.6 + hurtFx * 8))
		for (let i = 0; i < flips; i++) mGrid[Math.floor(Math.random() * mGrid.length)] = rndGlyph()
		updateEdge()
		if (state === 'title') return
		if (state === 'boot') {
			updateBoot(dt)
			return
		}
		if (state === 'shut') {
			updateShutdown(dt)
			return
		}
		if (state === 'over') {
			overT -= dt
			if (overT <= 0) startShutdown()
			return
		}
		if (state !== 'play') return
		formT += dt
		if (msgT > 0) msgT -= dt
		fireCd -= dt

		if (!player.dead) {
			player.inv = Math.max(0, player.inv - dt)
			const dx = (keys.right ? 1 : 0) - (keys.left ? 1 : 0)
			player.x = clamp(player.x + dx * 30 * dt, 4, COLS - 5)
			if (keys.fire && fireCd <= 0 && pBul.length < 2) {
				gunSide = -gunSide
				const gx = Math.round(player.x) + gunSide * GUN_OFFSET,
					gy = player.y + 0.5
				pBul.push({ x: gx, y: gy, py: gy })
				fireCd = 0.2
				sparkBurst(gx, gy - 0.2, 'red', 4, 1)
			}
		} else {
			player.respawn -= dt
			if (player.respawn <= 0) {
				if (lives > 0) {
					lives--
					player.dead = false
					player.inv = 2
					player.x = COLS / 2
				} else {
					setState('over')
					overT = 2.5
					saveHi()
					return
				}
			}
		}

		for (const b of pBul) {
			b.py = b.y
			b.y -= 45 * dt
		}
		pBul = pBul.filter((b) => b.y > 1)
		for (const b of eBul) {
			b.x += b.vx * dt
			b.y += b.vy * dt
		}
		eBul = eBul.filter((b) => b.y < ROWS - 1 && b.x > -1 && b.x < COLS)

		let entering = false,
			divers = 0
		for (const e of enemies) {
			if (!e.alive) continue
			if (e.state === 'wait') {
				entering = true
				e.delay -= dt
				if (e.delay <= 0) {
					e.state = 'enter'
					e.t = 0
				}
				continue
			}
			const sp = slotPos(e.slot)
			if (e.state === 'enter' || e.state === 'dive') {
				if (e.state === 'enter') entering = true
				else divers++
				e.t += dt / e.dur
				const p = bez(e.path.map((q) => q || sp), Math.min(e.t, 1))
				e.x = p.x
				e.y = p.y
				if (e.state === 'dive') {
					while (e.shotI! < e.shots!.length && e.t >= e.shots![e.shotI!]) {
						e.shotI!++
						if (!player.dead && e.y < player.y - 4) {
							const vy = 15 + wave * 0.8
							const vx = clamp((player.x - e.x) / ((player.y - e.y) / vy), -9, 9)
							eBul.push({ x: e.x, y: e.y + 1, vx, vy })
						}
					}
				}
				if (e.t >= 1) {
					if (e.state === 'enter') {
						e.state = 'form'
					} else {
						e.state = 'return'
						e.x = sp.x
						e.y = -2
					}
				}
			} else if (e.state === 'return') {
				e.y += 14 * dt
				e.x += (sp.x - e.x) * Math.min(1, dt * 4)
				if (e.y >= sp.y) e.state = 'form'
			} else {
				e.x = sp.x
				e.y = sp.y
			}
		}

		diveT -= dt
		const maxDivers = 1 + Math.floor(wave * 0.75)
		if (!entering && diveT <= 0 && !player.dead && divers < maxDivers) {
			const formed = enemies.filter((e) => e.alive && e.state === 'form')
			if (formed.length) {
				const e = formed[Math.floor(Math.random() * formed.length)]
				startDive(e)
				if (e.type === 'boss') {
					formed
						.filter(
							(o) =>
								o !== e && o.type === 'fly' && o.slot.row === 1 && Math.abs(o.slot.col - e.slot.col) <= 1
						)
						.slice(0, 2)
						.forEach((o, i) => startDive(o, i ? 1 : -1))
				}
			}
			diveT = Math.max(0.45, 2.0 - wave * 0.15) * (0.6 + Math.random() * 0.8)
		}

		for (const b of pBul) {
			for (const e of enemies) {
				if (!e.alive || e.state === 'wait') continue
				if (Math.abs(b.x - e.x) <= 1.6 && b.y <= e.y + 0.6 && b.py! >= e.y - 0.6) {
					b.hit = true
					e.hp--
					if (e.hp <= 0) killEnemy(e)
					else {
						sparkBurst(e.x, e.y, 'hurt', 14)
						parts.push({ k: 'flash', x: e.x, y: e.y, size: 4, life: 0.15, max: 0.15, col: 'hurt' })
						bloom += 0.3
					}
					break
				}
			}
		}
		pBul = pBul.filter((b) => !b.hit)

		if (!player.dead && player.inv <= 0) {
			for (const b of eBul) {
				if (hitsPlayer(b.x, b.y)) {
					killPlayer()
					break
				}
			}
		}
		if (!player.dead && player.inv <= 0) {
			for (const e of enemies) {
				if (
					e.alive &&
					e.state === 'dive' &&
					(hitsPlayer(e.x - 1, e.y) || hitsPlayer(e.x, e.y) || hitsPlayer(e.x + 1, e.y))
				) {
					killEnemy(e)
					killPlayer()
					break
				}
			}
		}

		if (enemies.every((e) => !e.alive)) {
			if (clearT <= 0) {
				clearT = 2.4
				msg = `WAVE ${wave} CLEAR`
				msgT = 2.2
			}
			clearT -= dt
			if (clearT <= 0) nextWave()
		}
	}

	const pad6 = (n: number) => String(n).padStart(6, '0')
	function hud() {
		text('SCORE', 1, 0, 'shot')
		text(pad6(score), 7, 0, 'ink')
		ctext('HIGH ' + pad6(Math.max(hi, score)), 0, 'ink')
		text(`WAVE ${wave}`, COLS - 8, 0, 'hurt')
	}
	const TOUCH = matchMedia('(hover:none) and (pointer:coarse)').matches
	const CTA = TOUCH ? 'TAP ANYWHERE TO START' : 'PRESS ANY KEY TO START'
	const CTA_ROW = Math.floor(ROWS / 2) + 2
	const TITLE = '404'
	const SUB = 'THIS PAGE IS NOT HERE.'
	const SHIP_Y = ROWS - 1 - PLAYER_ROWS - 1
	const TITLE_SHIP_Y = SHIP_Y + 2
	const SHIP_MOVE_DUR = reduceMotion ? 0.2 : 0.85
	function shipEase(u: number) {
		// thrust then soft settle — ease-out with a touch of overshoot
		const c1 = 1.15
		const c3 = c1 + 1
		return 1 + c3 * Math.pow(u - 1, 3) + c1 * Math.pow(u - 1, 2)
	}
	function bootShipY() {
		const u = shipEase(clamp(bootT / SHIP_MOVE_DUR, 0, 1))
		return TITLE_SHIP_Y + (SHIP_Y - TITLE_SHIP_Y) * u
	}

	const BOOT_DUR = reduceMotion ? 0.6 : 1.7
	let bootT = 0,
		bootFx: Record<string, number | boolean> = {}
	const ease = (u: number) => (u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2)
	function beamProgress() {
		return ease(clamp((bootT / BOOT_DUR - 0.1) / 0.7, 0, 1))
	}
	function beamRow() {
		return beamProgress() * (RR + 1)
	}
	function beamGameRow() {
		return beamRow() - rOY
	}
	function startBoot() {
		setState('boot')
		bootT = 0
		bootFx = {}
		score = 0
		wave = 1
		lives = 2
		parts = []
		pops = []
		pBul = []
		eBul = []
	}
	function updateBoot(dt: number) {
		bootT += dt
		glowMul = ease(clamp(bootT / BOOT_DUR, 0, 1))
		const g = beamGameRow()
		if (!bootFx.shatter && bootT >= 0.18) {
			bootFx.shatter = true
			const x0 = Math.floor((COLS - CTA.length) / 2)
			for (let i = 0; i < CTA.length; i++) {
				if (CTA[i] === ' ') continue
				const life = rnd(0.7, 1.2)
				parts.push({
					k: 'debris',
					x: x0 + i,
					y: CTA_ROW,
					vx: rnd(-5, 5),
					vy: -rnd(2, 9),
					drag: 0.5,
					g: 30,
					bounce: 0.3,
					vr: rnd(-9, 9),
					rot: 0,
					life,
					max: life,
					col: 'hull',
					ch: CTA[i]
				})
				if (Math.random() < 0.5) sparkBurst(x0 + i, CTA_ROW, 'hull', 2)
			}
		}
		if (!bootFx.hud && g >= 0.5) bootFx.hud = bootT
		if (!bootFx.ignite && g >= SHIP_Y + 0.5) {
			bootFx.ignite = true
			parts.push({ k: 'flash', x: COLS / 2, y: SHIP_Y, size: 6, life: 0.4, max: 0.4, col: 'red' })
			sparkBurst(COLS / 2, SHIP_Y - 0.3, 'red', 16, 1)
			bloom = Math.min(1.5, bloom + 1)
			shake = Math.max(shake, 0.35)
		}
		if (!bootFx.lives && g >= ROWS - 1) bootFx.lives = true
		if (bootT >= BOOT_DUR) {
			glowMul = 1
			startGame()
		}
	}

	const SHUT_DUR = reduceMotion ? 0.5 : 1.3
	let shutT = 0,
		shutFx: Record<string, boolean> = {}
	function shutProgress() {
		return ease(clamp(shutT / SHUT_DUR, 0, 1))
	}
	function shutBeamRow() {
		return (1 - shutProgress()) * (RR + 1)
	}
	function shutBeamGameRow() {
		return shutBeamRow() - rOY
	}
	function startShutdown() {
		setState('shut')
		shutT = 0
		shutFx = {}
		pBul = []
		eBul = []
	}
	function updateShutdown(dt: number) {
		shutT += dt
		glowMul = 1 - ease(clamp(shutT / SHUT_DUR, 0, 1))
		if (!shutFx.ship && shutBeamGameRow() <= SHIP_Y + PLAYER_ROWS) {
			shutFx.ship = true
			sparkBurst(COLS / 2, SHIP_Y + 1, 'hull', 12)
		}
		if (shutT >= SHUT_DUR) {
			glowMul = 0
			parts = []
			pops = []
			setState('title')
			t = 0
		}
	}
	function render() {
		clearGrid()
		rMask.fill(0)
		if (state === 'title') {
			const on = reduceMotion || t % 1.2 < 0.85
			ctext(TITLE, Math.floor(ROWS / 2) - 4, 'hull')
			ctext(SUB, Math.floor(ROWS / 2) - 2, 'dim')
			if (on) ctext(CTA, CTA_ROW, 'hull')
			queueShip(COLS / 2, TITLE_SHIP_Y)
			draw()
			return
		}
		if (state === 'boot') {
			if (bootT < 0.18) {
				const x0 = Math.floor((COLS - CTA.length) / 2)
				for (let i = 0; i < CTA.length; i++)
					if (CTA[i] !== ' ')
						put(x0 + i, CTA_ROW, Math.random() < bootT / 0.18 ? rndGlyph() : CTA[i], 'hull')
			}
			if (bootFx.hud) {
				for (let x = 0; x < COLS; x++) maskRain(x, 0)
				hud()
				const upto = Math.floor((bootT - (bootFx.hud as number)) * 110)
				for (let x = upto; x < COLS; x++) {
					gChar[x] = ' '
				}
				if (upto < COLS) put(upto, 0, '_', 'hull')
			}
			const sy = bootShipY()
			queueShip(COLS / 2, sy, !!bootFx.ignite)
			if (bootFx.lives)
				for (let i = 0; i < lives; i++) {
					text('/^\\', 1 + i * 4, ROWS - 1, 'hull')
					put(2 + i * 4, ROWS - 1, '^', 'red')
				}
			draw()
			return
		}
		for (let x = 0; x < COLS; x++) maskRain(x, 0)
		layer = 1
		hud()

		for (const e of enemies) {
			if (!e.alive || e.state === 'wait') continue
			const T = TYPES[e.type]
			const speed = e.state === 'dive' ? 6 : 2
			const fr = Math.floor(t * speed + e.phase) % 2
			const hurt = e.type === 'boss' && e.hp < T.hp
			sprite([hurt ? T.hurt![fr] : T.f[fr]], e.x, e.y, hurt ? 'hurt' : T.col)
		}
		for (const p of pops) text(p.s, Math.round(p.x) - 1, p.y, 'bee')

		if (!player.dead && !(player.inv > 0 && Math.floor(t * 10) % 2)) {
			queueShip(player.x, player.y, true)
		}
		for (let i = 0; i < lives; i++) {
			text('/^\\', 1 + i * 4, ROWS - 1, 'hull')
			put(2 + i * 4, ROWS - 1, '^', 'red')
		}

		if (msgT > 0 && state === 'play') ctext(msg, 20, 'bee')
		if (state === 'paused') {
			ctext('PAUSED', 18, 'bee')
			ctext('press P to resume', 20, 'ink')
		}
		if (state === 'over' || state === 'shut') {
			ctext('G A M E   O V E R', 15, 'shot')
			ctext(`SCORE ${score}` + (score >= hi && score > 0 ? '   NEW HIGH SCORE' : ''), 18, 'bee')
		}
		if (state === 'shut') {
			const cut = Math.ceil(shutBeamGameRow())
			for (let y = Math.max(0, cut); y < ROWS; y++) for (let x = 0; x < COLS; x++) gChar[y * COLS + x] = ' '
			if (shutFx.ship) queueShip(COLS / 2, SHIP_Y)
		}
		draw()
	}

	function primary() {
		if (state === 'over' && overT < 1.5) startShutdown()
	}
	function togglePause() {
		if (state === 'play') setState('paused')
		else if (state === 'paused') setState('play')
	}
	const KEYMAP: Record<string, keyof typeof keys> = {
		ArrowLeft: 'left',
		a: 'left',
		A: 'left',
		ArrowRight: 'right',
		d: 'right',
		D: 'right',
		' ': 'fire',
		ArrowUp: 'fire',
		w: 'fire',
		W: 'fire',
		z: 'fire',
		Z: 'fire'
	}

	function isChromeTarget(t: EventTarget | null) {
		return t instanceof Element && !!t.closest('a, button')
	}

	const onKeyDown = (e: KeyboardEvent) => {
		const onChrome = isChromeTarget(e.target)
		if (state === 'boot' || state === 'shut') {
			if (e.key === ' ' || e.key.startsWith('Arrow')) e.preventDefault()
			return
		}
		if (state === 'title') {
			if (e.repeat) return
			if (onChrome && (e.key === 'Enter' || e.key === ' ')) return
			if (e.key === ' ' || e.key.startsWith('Arrow')) e.preventDefault()
			startBoot()
			return
		}
		if (onChrome && e.key === 'Enter') return
		if (e.key === 'p' || e.key === 'P' || e.key === 'Escape') {
			togglePause()
			return
		}
		const k = KEYMAP[e.key]
		if (!k) return
		e.preventDefault()
		if (k === 'fire' && !e.repeat) primary()
		keys[k] = true
	}
	const onKeyUp = (e: KeyboardEvent) => {
		const k = KEYMAP[e.key]
		if (k) keys[k] = false
	}
	const onBlur = () => {
		keys.left = keys.right = keys.fire = false
		if (state === 'play') setState('paused')
	}
	const onCanvasPointer = () => {
		if (state === 'boot' || state === 'shut') return
		if (state === 'title') startBoot()
		else if (state === 'paused') togglePause()
		else primary()
	}
	const onDocPointer = (e: PointerEvent) => {
		if (state === 'title' && TOUCH && e.target !== canvas && !isChromeTarget(e.target) && !(e.target as Element)?.closest?.('.pad'))
			startBoot()
	}

	const padCleanups: (() => void)[] = []
	pad.querySelectorAll('button').forEach((btn) => {
		const k = (btn as HTMLButtonElement).dataset.k as keyof typeof keys
		const on = (e: Event) => {
			e.preventDefault()
			if (state === 'boot' || state === 'shut') return
			if (state === 'title') {
				startBoot()
				return
			}
			;(btn as HTMLElement).classList.add('is-down')
			keys[k] = true
			if (k === 'fire') {
				if (state === 'paused') togglePause()
				else primary()
			}
		}
		const off = (e: Event) => {
			e.preventDefault()
			;(btn as HTMLElement).classList.remove('is-down')
			keys[k] = false
		}
		btn.addEventListener('pointerdown', on)
		;['pointerup', 'pointerleave', 'pointercancel'].forEach((ev) => btn.addEventListener(ev, off))
		const onCtx = (e: Event) => e.preventDefault()
		btn.addEventListener('contextmenu', onCtx)
		padCleanups.push(() => {
			btn.removeEventListener('pointerdown', on)
			;['pointerup', 'pointerleave', 'pointercancel'].forEach((ev) => btn.removeEventListener(ev, off))
			btn.removeEventListener('contextmenu', onCtx)
		})
	})

	addEventListener('resize', resize)
	addEventListener('keydown', onKeyDown)
	addEventListener('keyup', onKeyUp)
	addEventListener('blur', onBlur)
	canvas.addEventListener('pointerdown', onCanvasPointer)
	document.addEventListener('pointerdown', onDocPointer)

	const scroller = root.closest('.scroll-root')
	const bgHome = bgCv.parentElement
	if (scroller) {
		scroller.insertBefore(bgCv, scroller.firstChild)
		scroller.appendChild(edgeEl)
		scroller.appendChild(flashEl)
	}

	const ro = new ResizeObserver(() => resize())
	ro.observe(stage)
	ro.observe(root)
	const onVV = () => resize()
	visualViewport?.addEventListener('resize', onVV)
	visualViewport?.addEventListener('scroll', onVV)

	player = { x: COLS / 2, y: SHIP_Y, dead: false, respawn: 0, inv: 0 }
	pBul = []
	eBul = []
	parts = []
	pops = []
	enemies = []
	els.onTitleChange(true)

	resize()
	requestAnimationFrame(() => requestAnimationFrame(resize))
	const fontReady =
		document.fonts
			? Promise.all([
					document.fonts.load(`${WEIGHT} 48px Inconsolata`),
					document.fonts.load(`${WEIGHT_BOLD} 48px Inconsolata`)
				])
					.then(resize)
					.catch(() => {})
			: Promise.resolve()

	let last = performance.now()
	let raf = 0
	function frame(now: number) {
		const dt = Math.min(0.05, (now - last) / 1000)
		last = now
		t += dt
		if (freeze > 0) {
			freeze -= dt
			updateFx(dt * 0.25)
		} else {
			update(dt)
			updateFx(state === 'paused' ? 0 : dt)
		}
		render()
		raf = requestAnimationFrame(frame)
	}
	raf = requestAnimationFrame(frame)

	return () => {
		cancelAnimationFrame(raf)
		ro.disconnect()
		visualViewport?.removeEventListener('resize', onVV)
		visualViewport?.removeEventListener('scroll', onVV)
		if (bgHome) {
			bgHome.insertBefore(bgCv, bgHome.firstChild)
			bgHome.insertBefore(edgeEl, bgHome.firstChild)
			bgHome.insertBefore(flashEl, bgHome.firstChild)
		}
		removeEventListener('resize', resize)
		removeEventListener('keydown', onKeyDown)
		removeEventListener('keyup', onKeyUp)
		removeEventListener('blur', onBlur)
		canvas.removeEventListener('pointerdown', onCanvasPointer)
		document.removeEventListener('pointerdown', onDocPointer)
		;[edgeEl, flashEl, screenEl].forEach((el) => el.removeEventListener('animationend', onAnimEnd))
		padCleanups.forEach((fn) => fn())
		void fontReady
	}
}
