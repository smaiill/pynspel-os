import { generateRandomNumberBetween } from './random'

export const getUserAvatar = (userId: number, avatarId: string) => {
  return `https://cdn.discordapp.com/avatars/${userId}/${avatarId}.png?size=128`
}

export const getDefaultAvatar = (id: number) => {
  return `https://cdn.discordapp.com/embed/avatars/${id}.png`
}

export const getGuildIcon = (guildId: string, icon?: string) =>
  `https://cdn.discordapp.com/icons/${guildId}/${icon}.png`

export const getRandomDefaultAvatar = () =>
  getDefaultAvatar(generateRandomNumberBetween(1, 5))
