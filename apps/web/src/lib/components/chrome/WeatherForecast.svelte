<script lang="ts">
	import { subscribeMedia } from '$lib/motion'

	let { open = $bindable(false) }: { open?: boolean } = $props()
	let tall = $state(false)
	let reduced = $state(false)
	let timer: ReturnType<typeof setTimeout> | undefined

	const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] as const

	$effect(() => subscribeMedia('(prefers-reduced-motion: reduce)', (matches) => (reduced = matches)))

	function toggle() {
		clearTimeout(timer)
		if (reduced) {
			open = !open
			tall = open
			return
		}
		if (!open) {
			open = true
			timer = setTimeout(() => (tall = true), 100)
		} else {
			open = false
			timer = setTimeout(() => (tall = false), 400)
		}
	}
</script>

<button
	type="button"
	class="weather"
	class:is-open={open}
	class:is-tall={tall}
	class:is-reduced={reduced}
	onclick={toggle}
	aria-expanded={open}
	aria-label="Today's weather. Tap to {open ? 'collapse' : 'expand'}."
>
	<header class="weather-head">
		<svg class="icon sun" viewBox="0 0 24 24" aria-hidden="true">
			<circle cx="12" cy="12" r="4" />
			<path
				d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
			/>
		</svg>
		<div class="reveal head-copy">
			<h3>Today's Weather</h3>
			<span class="badge">72°F</span>
		</div>
	</header>

	<div class="weather-body">
		<div class="summary">
			<div>
				<p class="temp">72°F</p>
				<p class="muted">Feels like 75°F</p>
			</div>
			<div class="summary-right">
				<p class="condition">Sunny</p>
				<p class="reveal muted" style:--i={0}>High 78° / Low 65°</p>
			</div>
		</div>

		<div class="details">
			<div class="stat reveal" style:--i={1}>
				<span class="stat-label">
					<svg class="icon" viewBox="0 0 24 24" aria-hidden="true">
						<path d="M17.5 19a4.5 4.5 0 1 0-.3-9 6 6 0 1 0-11.4 2A4 4 0 0 0 6 19Z" />
					</svg>
					Humidity
				</span>
				<span>45%</span>
			</div>
			<div class="stat reveal" style:--i={2}>
				<span class="stat-label">
					<svg class="icon" viewBox="0 0 24 24" aria-hidden="true">
						<path d="M17.7 7A3 3 0 0 0 14 5H4M3 12h14a3 3 0 1 1-3 3M5 19h8a2 2 0 1 0-2-2" />
					</svg>
					Wind
				</span>
				<span>8 mph</span>
			</div>
			<div class="stat reveal" style:--i={3}>
				<span class="stat-label">
					<svg class="icon" viewBox="0 0 24 24" aria-hidden="true">
						<path d="M12 2.7c.4.5 4.5 5.7 4.5 9.3a4.5 4.5 0 1 1-9 0C7.5 8.4 11.6 3.2 12 2.7Z" />
					</svg>
					Precipitation
				</span>
				<span>0%</span>
			</div>

			<div class="forecast reveal" style:--i={4}>
				<h4>5-Day Forecast</h4>
				{#each days as day, i}
					<div class="day">
						<span>{day}</span>
						<span class="day-temp">
							<svg class="icon sun sm" viewBox="0 0 24 24" aria-hidden="true">
								<circle cx="12" cy="12" r="4" />
								<path
									d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
								/>
							</svg>
							{70 + i}°F
						</span>
					</div>
				{/each}
			</div>
		</div>
	</div>

	<footer class="weather-foot">Last updated: 5 minutes ago</footer>
</button>

<style>
	.weather {
		display: flex;
		flex-direction: column;
		width: 300px;
		max-width: 100%;
		height: 220px;
		padding: 1rem 1.1rem;
		border: 1px solid rgb(0 0 0 / 0.08);
		border-radius: 1rem;
		background: #fff;
		color: #1f2937;
		box-shadow: 0 18px 40px rgb(0 0 0 / 0.18);
		text-align: left;
		overflow: hidden;
		cursor: pointer;
		transition:
			width 320ms cubic-bezier(0.34, 1.3, 0.64, 1),
			height 320ms cubic-bezier(0.34, 1.3, 0.64, 1);
	}

	.weather.is-tall {
		width: min(500px, 100%);
		height: 420px;
	}

	.weather.is-reduced {
		transition: none;
	}

	.weather-head {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		flex-shrink: 0;
	}

	.head-copy h3 {
		margin: 0;
		font-size: 1.05rem;
		font-weight: 500;
		line-height: 1.2;
	}

	.badge {
		display: inline-block;
		margin-top: 0.2rem;
		padding: 0.15rem 0.5rem;
		border-radius: 999px;
		background: #dbeafe;
		color: #1e40af;
		font-size: 0.75rem;
		font-weight: 600;
	}

	.weather-body {
		margin-top: 0.85rem;
	}

	.summary {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 0.75rem;
		margin-bottom: 1rem;
	}

	.temp {
		margin: 0;
		font-size: 1.6rem;
		font-weight: 700;
		line-height: 1.1;
	}

	.condition {
		margin: 0;
		font-weight: 500;
	}

	.summary-right {
		text-align: right;
	}

	.muted {
		margin: 0.15rem 0 0;
		font-size: 0.85rem;
		color: #6b7280;
	}

	.details {
		display: flex;
		flex-direction: column;
		gap: 0.45rem;
	}

	.stat,
	.day {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.75rem;
		font-size: 0.9rem;
	}

	.stat-label,
	.day-temp {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
	}

	.forecast {
		margin-top: 0.65rem;
	}

	.forecast h4 {
		margin: 0 0 0.4rem;
		font-size: 0.95rem;
		font-weight: 500;
	}

	.day + .day {
		margin-top: 0.3rem;
	}

	.weather-foot {
		margin-top: 0.85rem;
		font-size: 0.7rem;
		color: #9ca3af;
	}

	.icon {
		width: 1.15rem;
		height: 1.15rem;
		flex-shrink: 0;
		stroke: currentColor;
		stroke-width: 1.75;
		stroke-linecap: round;
		stroke-linejoin: round;
		fill: none;
		color: #9ca3af;
	}

	.icon.sun {
		width: 2rem;
		height: 2rem;
		color: #facc15;
		stroke: #facc15;
	}

	.icon.sun.sm {
		width: 1rem;
		height: 1rem;
	}

	.reveal {
		opacity: 0;
		filter: blur(4px);
		transform: translateY(20px) rotate(-5deg);
		transition:
			opacity 320ms cubic-bezier(0.34, 1.3, 0.64, 1),
			filter 320ms cubic-bezier(0.34, 1.3, 0.64, 1),
			transform 320ms cubic-bezier(0.34, 1.3, 0.64, 1);
		transition-delay: 0ms;
		pointer-events: none;
	}

	.is-open .reveal {
		opacity: 1;
		filter: blur(0);
		transform: none;
		transition-delay: calc(var(--i, 0) * 100ms);
		pointer-events: auto;
	}

	.is-reduced .reveal {
		filter: none;
		transform: none;
		transition: none;
	}

	.is-reduced.is-open .reveal {
		opacity: 1;
	}

	.is-reduced:not(.is-open) .reveal {
		opacity: 0;
	}
</style>
