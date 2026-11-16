<script lang="ts">
	import { tick } from 'svelte'
	import { sound } from '$lib/actions/sfx'
	import { flashCopied } from '$lib/cursorNotice.svelte'
	import type { Service } from '$lib/data/services'
	import { currentLang, t } from '$lib/i18n'
	import { sfx } from '$lib/sfx/palette'

	/**
	 * Enquiry form. With an `endpoint` (a form service such as Formspree) it posts the enquiry as
	 * JSON. Without one nothing can be sent from a static site, so submitting copies the contact
	 * email to the clipboard and says so; the visitor's text stays on screen.
	 */
	let { services, email, endpoint }: { services: Service[]; email?: string; endpoint?: string } = $props()

	let name = $state('')
	let agency = $state('')
	let from = $state('')
	let service = $state('')
	let timeline = $state('')
	let budget = $state('')
	let message = $state('')
	/** Honeypot: people never see this field, so anything in it is a bot. */
	let trap = $state('')

	type Status = 'idle' | 'sending' | 'sent' | 'copied' | 'copyFailed' | 'error'
	let status = $state<Status>('idle')
	let errors = $state<{ name?: string; from?: string; message?: string }>({})
	let formEl: HTMLFormElement | undefined = $state()

	const emailOk = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())

	function validate() {
		const next: typeof errors = {}
		if (!name.trim()) next.name = t('form.required')
		if (!from.trim()) next.from = t('form.required')
		else if (!emailOk(from)) next.from = t('form.invalidEmail')
		if (!message.trim()) next.message = t('form.required')
		return next
	}

	async function copyContactEmail() {
		if (!email) {
			status = 'error'
			return
		}
		try {
			await navigator.clipboard.writeText(email)
			status = 'copied'
			flashCopied()
			sfx.confirm()
		} catch {
			status = 'copyFailed'
		}
	}

	async function submit(event: SubmitEvent) {
		event.preventDefault()
		if (status === 'sending') return
		errors = validate()
		if (Object.keys(errors).length) {
			await tick()
			formEl?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus()
			return
		}
		if (trap) {
			status = 'sent'
			return
		}
		if (!endpoint) {
			await copyContactEmail()
			return
		}
		status = 'sending'
		try {
			const res = await fetch(endpoint, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
				body: JSON.stringify({
					name,
					agency,
					email: from,
					service,
					timeline,
					budget,
					message,
					language: currentLang()
				})
			})
			if (!res.ok) throw new Error(String(res.status))
			status = 'sent'
			sfx.confirm()
		} catch {
			status = 'error'
		}
	}
</script>

<form bind:this={formEl} class="form" onsubmit={submit} novalidate aria-labelledby="enquire-h">
	<p class="font-label label">{t('form.label')}</p>
	<h2 id="enquire-h" class="title">{t('form.title')}</h2>
	<p class="lead">{t('form.lead')}</p>

	{#if status === 'sent'}
		<p class="status ok" role="status">{t('form.sent')}</p>
	{:else}
		<div class="grid">
			<div class="field">
				<label for="f-name">{t('form.name')}</label>
				<input
					id="f-name"
					name="name"
					autocomplete="name"
					bind:value={name}
					aria-invalid={errors.name ? 'true' : undefined}
					aria-describedby={errors.name ? 'f-name-err' : undefined}
				/>
				{#if errors.name}<span id="f-name-err" class="err">{errors.name}</span>{/if}
			</div>
			<div class="field">
				<label for="f-agency">{t('form.agency')}</label>
				<input id="f-agency" name="agency" autocomplete="organization" bind:value={agency} />
			</div>
			<div class="field">
				<label for="f-email">{t('form.email')}</label>
				<input
					id="f-email"
					name="email"
					type="email"
					autocomplete="email"
					bind:value={from}
					aria-invalid={errors.from ? 'true' : undefined}
					aria-describedby={errors.from ? 'f-email-err' : undefined}
				/>
				{#if errors.from}<span id="f-email-err" class="err">{errors.from}</span>{/if}
			</div>
			<div class="field">
				<label for="f-service">{t('form.service')}</label>
				<select id="f-service" name="service" bind:value={service}>
					<option value=""></option>
					{#each services as s (s.id)}<option value={s.title}>{s.title}</option>{/each}
					<option value={t('form.serviceOther')}>{t('form.serviceOther')}</option>
				</select>
			</div>
			<div class="field">
				<label for="f-timeline">{t('form.timeline')}</label>
				<input id="f-timeline" name="timeline" bind:value={timeline} />
			</div>
			<div class="field">
				<label for="f-budget">{t('form.budget')}</label>
				<input id="f-budget" name="budget" bind:value={budget} />
			</div>
			<div class="field wide">
				<label for="f-message">{t('form.message')}</label>
				<textarea
					id="f-message"
					name="message"
					rows="5"
					bind:value={message}
					aria-invalid={errors.message ? 'true' : undefined}
					aria-describedby={errors.message ? 'f-message-err' : undefined}
				></textarea>
				{#if errors.message}<span id="f-message-err" class="err">{errors.message}</span>{/if}
			</div>
			<div class="trap" aria-hidden="true">
				<label>Website <input name="website" tabindex="-1" autocomplete="off" bind:value={trap} /></label>
			</div>
		</div>

		<div class="actions">
			<button type="submit" class="send" disabled={status === 'sending'} use:sound>
				{status === 'sending' ? t('form.sending') : endpoint ? t('form.send') : t('form.copyButton')}
			</button>
			<p class="status" role="status" aria-live="polite">
				{#if status === 'copied'}{t('form.copyDone')}
				{:else if status === 'copyFailed'}{t('form.copyFailed', { email: email ?? '' })}
				{:else if status === 'error'}{t('form.error')}{/if}
			</p>
		</div>
	{/if}
</form>

<style>
	.form {
		padding: clamp(3rem, 8vh, 5rem) 0;
		/* Clears the fixed nav when jumped to via #enquire. */
		scroll-margin-top: 4rem;
	}
	.label {
		margin: 0 0 1rem;
		color: var(--fg-muted);
	}
	.title {
		margin: 0;
		font-family: var(--font-display);
		font-size: var(--text-h1);
		line-height: var(--text-h1--line-height);
		letter-spacing: var(--text-h1--letter-spacing);
		font-weight: 400;
	}
	.lead {
		max-width: 34rem;
		margin: 1rem 0 2rem;
		color: var(--fg-muted);
		line-height: 1.55;
	}
	.grid {
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		gap: 1.25rem 1.5rem;
		max-width: 44rem;
	}
	.field {
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
	}
	label {
		font-size: 0.875rem;
		color: var(--fg-muted);
	}
	input,
	select,
	textarea {
		width: 100%;
		padding: 0.75rem 0.9rem;
		border: 1px solid var(--rule);
		border-radius: 0.75rem;
		background: transparent;
		color: var(--fg);
		font: inherit;
		font-size: 1rem;
		letter-spacing: 0;
		transition: border-color 200ms var(--ease);
	}
	textarea {
		resize: vertical;
		min-height: 8rem;
	}
	input:hover,
	select:hover,
	textarea:hover {
		border-color: var(--fg-muted);
	}
	[aria-invalid='true'] {
		border-color: var(--fg);
	}
	.err {
		font-size: 0.8125rem;
		color: var(--fg);
	}
	.trap {
		position: absolute;
		left: -9999px;
		width: 1px;
		height: 1px;
		overflow: hidden;
	}
	.actions {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 1rem 1.5rem;
		margin-top: 1.75rem;
	}
	.send {
		padding: 0.85rem 1.4rem;
		border: 1px solid var(--fg);
		border-radius: 999px;
		background: var(--fg);
		color: var(--bg);
		font: inherit;
		font-size: 0.9375rem;
		font-weight: 500;
		cursor: pointer;
		transition: opacity 200ms var(--ease);
	}
	.send:disabled {
		opacity: 0.6;
		cursor: default;
	}
	.status {
		margin: 0;
		max-width: 30rem;
		color: var(--fg-muted);
		line-height: 1.5;
	}
	.status.ok {
		color: var(--fg);
		font-size: var(--text-lead);
	}
	@media (min-width: 768px) {
		.grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
		.wide {
			grid-column: 1 / -1;
		}
	}
</style>
