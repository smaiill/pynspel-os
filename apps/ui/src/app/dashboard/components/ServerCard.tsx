import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { FlexColumn } from '~/layouts/Flex'
import { ButtonPrimary } from '~/ui/button/Button'
import { Typography } from '~/ui/typography/Typography'
import style from './server.card.module.scss'

const ServerCard = (props: any) => {
  const router = useRouter()

  const handleManageGuild = () => {
    router.push(`/dashboard/${props.id}`)
  }

  return (
    <FlexColumn className={style.card}>
      <Image
        alt="server-image"
        width={75}
        height={75}
        src={''}
        // src={`https://cdn.discordapp.com/icons/${props.id}/${props.icon}.png`}
      />
      <Typography variant="h4">{props.name}</Typography>
      <ButtonPrimary onClick={handleManageGuild}>Gérer</ButtonPrimary>
    </FlexColumn>
  )
}

export { ServerCard }
