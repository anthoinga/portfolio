export type ColorScheme = 'light' | 'dark'
export type ProjectType = 'case-study' | 'gallery' | 'blank'

export type HexColor = string

export type Credit = {
	org: string
	role?: string
	years?: string
}

export type SiteSettings = {
	name: string
	role?: string
	bio?: string
	email?: string
	github?: string
	linkedin?: string
	cv?: string
	experiences: Credit[]
	awards: Credit[]
}

export type MediaRef = {
	url: string
	alt?: string
}

export type ProjectCard = {
	_id: string
	title: string
	slug: string
	description?: string
	tags: string[]
	type: ProjectType
	scope?: string
	year?: number
	weight: number
	hidden: boolean
	colorScheme: ColorScheme
	colorAccent: HexColor
	colorLight: HexColor
	colorDark: HexColor
	colorDarkest: HexColor
	previewVideo?: MediaRef | null
	poster?: MediaRef | null
	externalUrl?: string
}

export type NextProjectPreview = Pick<
	ProjectCard,
	| '_id'
	| 'title'
	| 'slug'
	| 'colorAccent'
	| 'colorLight'
	| 'colorDark'
	| 'colorDarkest'
	| 'colorScheme'
	| 'poster'
	| 'hidden'
	| 'weight'
>

export type CaptionFlags = {
	label?: string
	title?: string
	text?: string
	wideSpacing?: boolean
	overlay?: boolean
	topPadding?: boolean
	fillHeight?: boolean
	rowSpan?: number
	stroke?: boolean
}

export type MediaItem = CaptionFlags & {
	_key: string
	kind: 'image' | 'video' | 'copy'
	image?: MediaRef | null
	video?: MediaRef | null
	poster?: MediaRef | null
	heading?: string
	paragraphs?: string[]
	lead?: boolean
	span?: boolean
}

export type PortableBlock =
	| {
			_type: 'block'
			_key: string
			style?: string
			markDefs?: unknown[]
			children?: { _type?: string; _key?: string; text: string; marks?: string[] }[]
	  }
	| { _type: 'fullImage'; _key: string; image: MediaRef; priority?: boolean }
	| { _type: 'layoutBlock'; _key: string; ratio: string; items: MediaItem[] }
	| {
			_type: 'videoBlock'
			_key: string
			file?: MediaRef | null
			poster?: MediaRef | null
			canScrub?: boolean
			seekOnScroll?: boolean
			width?: number
			height?: number
	  }
	| { _type: 'team'; _key: string; members: { name: string; position?: string }[] }
	| { _type: 'listBlock'; _key: string; items: { label?: string; text?: string }[] }
	| { _type: 'quoteBlock'; _key: string; text: string; who?: string; title?: string }
	| { _type: 'slideShow'; _key: string; label?: string; text?: string; slides: MediaRef[] }
	| { _type: 'spacer'; _key: string }

export type PageWhen = 'cross' | 'reveal' | 'past' | 'center' | 'enter'

export type PageColorStop = { at: string; color: string; when?: PageWhen; line?: number }

export type ProjectFact = { label: string; items: string[] }

export type Project = ProjectCard & {
	seoTitle?: string
	seoDescription?: string
	ogImage?: MediaRef | null
	nextProject?: NextProjectPreview | null
	pageColor?: string
	colorStops?: PageColorStop[]
	brief?: { paragraphs: string[]; facts: ProjectFact[] }
	body: PortableBlock[]
}
