#!/usr/bin/env node
/**
 * Browser smoke + accessibility checks against a running site.
 *
 *   node apps/web/scripts/smoke.mjs http://127.0.0.1:4173
 *
 * Needs Playwright (`npm i -g playwright && playwright install chromium`, with
 * NODE_PATH=$(npm root -g)). Accessibility uses axe-core; only serious and
 * critical findings fail the run.
 */
import { createRequire } from 'node:module'
import fs from 'node:fs'

const require = createRequire(import.meta.url)
const { chromium } = require('playwright')
const axeSource = fs.readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8')

const base = (process.argv[2] ?? 'http://127.0.0.1:4173').replace(/\/$/, '')
// A normal browser UA: the intro is deliberately skipped for bots and headless agents.
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36'
const PATHS = ['/', '/playground', '/skills', '/work-with-me', '/developers', '/privacy', '/projects/curbside', '/projects/convenience']

let failed = 0
let passed = 0
const ok = (n) => (passed++, console.log(`  ✔ ${n}`))
const bad = (n, why) => (failed++, console.log(`  ✘ ${n}\n      ${why}`))

const browser = await chromium.launch()
async function open(opts = {}) {
	const ctx = await browser.newContext({ userAgent: UA, viewport: { width: 1440, height: 900 }, ...opts })
	const page = await ctx.newPage()
	const errors = []
	page.on('pageerror', (e) => errors.push(e.message))
	page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
	await page.addInitScript(() => sessionStorage.setItem('intro', 'done'))
	return { ctx, page, errors }
}

console.log(`Smoke testing ${base}\n\nRoutes (en + es, light + dark, desktop + phone)`)
for (const lang of ['', '/es']) {
	for (const p of PATHS) {
		const path = p === '/' ? lang || '/' : `${lang}${p}`
		for (const [label, opts] of [
			['desktop light', { colorScheme: 'light' }],
			['phone dark', { colorScheme: 'dark', viewport: { width: 390, height: 844 } }]
		]) {
			const { ctx, page, errors } = await open(opts)
			const name = `${path} (${label})`
			try {
				const res = await page.goto(base + path, { waitUntil: 'networkidle' })
				await page.waitForTimeout(700)
				const info = await page.evaluate(() => ({
					lang: document.documentElement.lang,
					h1: document.querySelectorAll('h1').length,
					main: !!document.querySelector('#main'),
					overflow: document.documentElement.scrollWidth > window.innerWidth + 1 ||
						(document.querySelector('.scroll-root')?.scrollWidth ?? 0) > window.innerWidth + 1
				}))
				const problems = []
				if (res.status() !== 200) problems.push(`HTTP ${res.status()}`)
				if (info.lang !== (lang ? 'es-PE' : 'en')) problems.push(`html lang is "${info.lang}"`)
				if (info.h1 !== 1) problems.push(`${info.h1} <h1> elements`)
				if (!info.main) problems.push('no #main landmark')
				if (info.overflow) problems.push('horizontal overflow')
				if (errors.length) problems.push(`console errors: ${[...new Set(errors)].join(' | ').slice(0, 160)}`)
				problems.length ? bad(name, problems.join('; ')) : ok(name)
			} catch (e) {
				bad(name, e.message)
			}
			await ctx.close()
		}
	}
}

console.log('\nAccessibility (axe-core: serious + critical)')
for (const scheme of ['light', 'dark']) {
	for (const path of ['/', '/skills', '/work-with-me', '/es/playground', '/developers', '/projects/curbside']) {
		const { ctx, page } = await open({ colorScheme: scheme })
		try {
			await page.goto(base + path, { waitUntil: 'networkidle' })
			await page.waitForTimeout(900)
			const results = await page.evaluate(async (src) => {
				// eslint-disable-next-line no-eval
				;(0, eval)(src)
				// The site logo is white text under mix-blend-mode: exclusion, which renders as the inverse of
				// the page background. axe cannot see blend modes and reads it as white on white, so it is
				// excluded here and checked exactly below.
				return await window.axe.run({ exclude: [['.site-logo']] }, { resultTypes: ['violations'] })
			}, axeSource)
			const logo = await page.evaluate(() => {
				if (!document.querySelector('.site-logo')) return null
				const m = getComputedStyle(document.querySelector('.scroll-root')).backgroundColor.match(/[\d.]+/g)
				if (!m) return null
				const lin = (v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4)
				const lum = (c) => 0.2126 * lin(c[0]) + 0.7152 * lin(c[1]) + 0.0722 * lin(c[2])
				const bg = m.slice(0, 3).map((n) => Number(n) / 255)
				// White source under exclusion: result = backdrop + 1 - 2 * backdrop = 1 - backdrop.
				const out = bg.map((c) => 1 - c)
				const [hi, lo] = [lum(bg), lum(out)].sort((a, b) => b - a)
				return (hi + 0.05) / (lo + 0.05)
			})
			if (logo !== null && logo < 4.5) bad(`${path} (${scheme}) site logo`, `blended contrast ${logo.toFixed(2)}:1`)
			const hard = results.violations.filter((v) => ['serious', 'critical'].includes(v.impact))
			if (hard.length) {
				bad(`${path} (${scheme})`, hard.map((v) => `${v.id} ×${v.nodes.length}: ${v.nodes[0].target.join(' ').slice(0, 90)}`).join('\n      '))
			} else ok(`${path} (${scheme})`)
		} catch (e) {
			bad(`${path} (${scheme})`, e.message)
		}
		await ctx.close()
	}
}

console.log('\nBehaviour')
{
	// Intro: once per session, never on internal navigation.
	const ctx = await browser.newContext({ userAgent: UA, viewport: { width: 1440, height: 900 } })
	const page = await ctx.newPage()
	await page.goto(base + '/')
	await page.waitForTimeout(500)
	const shown = await page.locator('.intro').count()
	shown ? ok('first visit shows the intro') : bad('first visit shows the intro', 'no .intro element')
	await page.keyboard.press('Escape')
	await page.waitForTimeout(900)
	const gone = (await page.locator('.intro').count()) === 0
	gone ? ok('Escape skips the intro') : bad('Escape skips the intro', 'still visible')
	await page.click('.menu-btn')
	await page.click('#site-menu a[href="/work-with-me"]')
	await page.waitForTimeout(500)
	await page.click('.site-logo')
	await page.waitForTimeout(700)
	;(await page.locator('.intro').count()) === 0
		? ok('going home from inside the site does not replay the intro')
		: bad('going home does not replay the intro', 'intro came back')
	// Theme + language persistence
	await page.click('button[aria-label^="Switch to"]')
	await page.reload()
	const theme = await page.evaluate(() => document.documentElement.dataset.theme)
	theme ? ok(`theme survives a reload (${theme})`) : bad('theme survives a reload', 'no data-theme')
	await page.click('a.lang-btn')
	await page.waitForURL('**/es')
	ok('language switch keeps you on the same page in Spanish')
	await ctx.close()
	const fresh = await browser.newContext({ userAgent: UA, viewport: { width: 1440, height: 900 } })
	const p2 = await fresh.newPage()
	await p2.goto(base + '/')
	await p2.waitForTimeout(500)
	;(await p2.locator('.intro').count()) === 1
		? ok('a new session shows the intro again')
		: bad('a new session shows the intro again', 'not shown')
	await fresh.close()
}

await browser.close()
console.log(`\n${passed} passed, ${failed} failed`)
process.exit(failed ? 1 : 0)
