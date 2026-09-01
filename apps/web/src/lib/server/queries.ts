export const siteSettingsQuery = `*[_type == "siteSettings" && _id == "siteSettings"][0]{
  name,
  role,
  bio,
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
  description,
  tags,
  type,
  scope,
  weight,
  hidden,
  colorScheme,
  "colorAccent": coalesce(colorAccent.hex, colorAccent),
  "colorLight": coalesce(colorLight.hex, colorLight),
  "colorDark": coalesce(colorDark.hex, colorDark),
  "colorDarkest": coalesce(colorDarkest.hex, colorDarkest),
  "previewVideo": previewVideo.asset->{ "url": url },
  "poster": {
    "url": poster.asset->url,
    "alt": poster.alt
  },
  "ogImage": {
    "url": ogImage.asset->url,
    "alt": ogImage.alt
  }
`

const nextProjectProjection = `
  _id, title, "slug": slug.current, hidden, weight, colorScheme,
  "colorAccent": coalesce(colorAccent.hex, colorAccent),
  "colorLight": coalesce(colorLight.hex, colorLight),
  "colorDark": coalesce(colorDark.hex, colorDark),
  "colorDarkest": coalesce(colorDarkest.hex, colorDarkest),
  "poster": { "url": poster.asset->url, "alt": poster.alt }
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
  seoTitle,
  seoDescription,
  body[]{
    ${bodyProjection}
  }
`

export const allProjectsQuery = `*[_type == "project"] | order(weight asc) {
  ${projectFields}
}`
