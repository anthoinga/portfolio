/// <reference types="@sveltejs/kit" />

declare module '*.svg?raw' {
	const src: string
	export default src
}

declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {}
