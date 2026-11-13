/**
 * Spanish lives beside English as `fooEs` fields. With `$lang == "es"` a
 * filled-in Spanish field wins; an empty one falls back to English, so a
 * half-translated document never renders blank.
 */
const L = (field: string) => `select($lang == "es" => coalesce(${field}Es, ${field}), ${field})`

export const siteSettingsQuery = `*[_type == "siteSettings" && _id == "siteSettings"][0]{
  name,
  "role": ${L('role')},
  "bio": ${L('bio')},
  email,
  github,
  linkedin,
  cv,
  experiences[]{ org, role, years },
  awards[]{ org, role }
}`

const projectCardProjection = `
  _id,
  title,
  "slug": slug.current,
  "description": ${L('description')},
  tags,
  type,
  "scope": ${L('scope')},
  year,
  weight,
  hidden,
  colorScheme,
  "colorAccent": coalesce(colorAccent.hex, colorAccent),
  "colorLight": coalesce(colorLight.hex, colorLight),
  "colorDark": coalesce(colorDark.hex, colorDark),
  "colorDarkest": coalesce(colorDarkest.hex, colorDarkest),
  "previewVideo": previewVideo.asset->{ "url": url },
  "poster": select(defined(poster.asset) => { "url": poster.asset->url, "alt": poster.alt }),
  "ogImage": select(defined(ogImage.asset) => { "url": ogImage.asset->url, "alt": ogImage.alt })
`

const nextProjectProjection = `
  _id, title, "slug": slug.current, hidden, weight, colorScheme,
  "colorAccent": coalesce(colorAccent.hex, colorAccent),
  "colorLight": coalesce(colorLight.hex, colorLight),
  "colorDark": coalesce(colorDark.hex, colorDark),
  "colorDarkest": coalesce(colorDarkest.hex, colorDarkest),
  "poster": select(defined(poster.asset) => { "url": poster.asset->url, "alt": poster.alt })
`

const bodyProjection = `
  ...,
  _type == "fullImage" => {
    "image": { "url": image.asset->url, "alt": image.alt }
  },
  _type == "layoutBlock" => {
    ratio,
    items[]{
      ...,
      "image": { "url": image.asset->url, "alt": image.alt },
      "video": { "url": video.asset->url },
      "poster": { "url": poster.asset->url, "alt": poster.alt }
    }
  },
  _type == "videoBlock" => {
    canScrub,
    seekOnScroll,
    width,
    height,
    "file": { "url": file.asset->url },
    "poster": { "url": poster.asset->url, "alt": poster.alt }
  },
  _type == "slideShow" => {
    label,
    text,
    "slides": slides[]{ "url": asset->url, "alt": alt }
  }
`

const projectFields = `
  ${projectCardProjection},
  "nextProject": nextProject->{
    ${nextProjectProjection}
  },
  "seoTitle": ${L('seoTitle')},
  "seoDescription": ${L('seoDescription')},
  "pageColor": coalesce(pageColor.hex, pageColor),
  "colorStops": colorStops[]{ at, "color": coalesce(color.hex, color), when, line },
  "brief": select($lang == "es" && defined(briefEs.paragraphs) => briefEs, brief){
    paragraphs,
    facts[]{ label, items }
  },
  "body": select($lang == "es" && count(bodyEs) > 0 => bodyEs, body)[]{
    ${bodyProjection}
  }
`

export const allProjectsQuery = `*[_type == "project"] | order(weight asc) {
  ${projectFields}
}`
