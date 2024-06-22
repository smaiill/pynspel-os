import slugify from 'slugify'

export const toSlug = (text: string) =>
  slugify(text, {
    replacement: '-',
    remove: undefined,
    lower: true,
    strict: true,
    locale: 'vi',
    trim: true,
  })
