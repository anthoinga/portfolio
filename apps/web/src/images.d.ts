// Bundled images imported with vite-imagetools options resolve to a URL string.
// (TypeScript allows one `*` per pattern, so match the exact options used.)
declare module '*?w=2000&format=webp&quality=82' {
	const src: string
	export default src
}
