import { EmbedBuilder } from '@discordjs/builders'
import { EMBED_SCHEMA } from '@pynspel/common'
import { z } from 'zod'

export const buildEmbed = (embed: z.infer<typeof EMBED_SCHEMA>) => {
  const embedBuilder = new EmbedBuilder().setColor(embed.color)

  if (embed.author) {
    embedBuilder.setAuthor(embed.author)
  }

  if (embed.description) {
    embedBuilder.setDescription(embed.description)
  }

  if (embed.fields && embed.fields.length) {
    embedBuilder.setFields(embed.fields)
  }

  if (embed.footer) {
    embedBuilder.setFooter(embed.footer)
  }

  if (embed.image?.url) {
    embedBuilder.setImage(embed.image.url)
  }

  if (embed.thumbnail?.url) {
    embedBuilder.setThumbnail(embed.thumbnail.url)
  }

  if (embed.timestamp) {
    embedBuilder.setTimestamp()
  }

  if (embed.title) {
    embedBuilder.setTitle(embed.title)
  }

  if (embed.url) {
    embedBuilder.setURL(embed.url)
  }

  return embedBuilder.toJSON()
}
