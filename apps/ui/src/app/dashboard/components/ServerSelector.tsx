import { HTMLAttributes, PropsWithChildren, useEffect, useState } from 'react'
import { useCurrentGuildValue } from '~/proxys/dashboard'
import { useUserGuildsValue } from '~/proxys/user'
import { InputSelect } from '~/ui/input/InputSelect'

export const ServerSelector = (
  props: PropsWithChildren<HTMLAttributes<HTMLDivElement>>
) => {
  const userGuilds = useUserGuildsValue()
  const selectedGuild = useCurrentGuildValue()
  const [value, setValue] = useState(selectedGuild?.guild_id)

  const formatedGuilds = userGuilds.map((guild) => {
    return { label: guild.name, value: guild.id }
  })

  useEffect(() => {
    setValue(selectedGuild?.guild_id)
  }, [selectedGuild])

  return (
    <InputSelect
      {...props}
      options={formatedGuilds}
      value={value}
      setValue={setValue}
    />
  )
}
