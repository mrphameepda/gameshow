// src/config/seo.ts
import { siteConfig } from './siteConfig'

interface SeoMeta {
  title: string
  description?: string
  image?: string
  noIndex?: boolean
}

export function buildMeta(meta: SeoMeta) {
  const title = meta.title.includes(siteConfig.name)
    ? meta.title
    : `${meta.title} | ${siteConfig.name}`

  return {
    title,
    description: meta.description ?? siteConfig.description,
    ogTitle: title,
    ogDescription: meta.description ?? siteConfig.description,
    ogImage: meta.image ?? siteConfig.ogImage,
    ogUrl: siteConfig.url,
    twitterCard: 'summary_large_image',
    twitterSite: siteConfig.twitter,
  }
}

export const pageMeta = {
  home: buildMeta({
    title: siteConfig.fullName,
    description: siteConfig.description,
  }),
  rcv: buildMeta({
    title: 'Rung Chuông Vàng PRO – Gameshow Giáo Lý Tương Tác',
    description:
      'Trải nghiệm Rung Chuông Vàng phiên bản Công Giáo – Phù hợp cho lớp giáo lý, sinh hoạt thiếu nhi và các buổi họp cộng đoàn.',
  }),
}
