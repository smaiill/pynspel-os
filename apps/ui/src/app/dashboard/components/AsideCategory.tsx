import { ChevronDown } from 'lucide-react'
import { PropsWithChildren } from 'react'
import { Flex, FlexColumn } from '~/layouts/Flex'
import { Typography } from '~/ui/typography/Typography'

const AsideCategory = (props: PropsWithChildren) => {
  const { children } = props
  return (
    <FlexColumn>
      <Flex
        style={{
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Typography
          style={{
            fontWeight: 600,
          }}
          color="secondary"
          as="p"
        >
          Gestion du serveur
        </Typography>
        <ChevronDown />
      </Flex>
      <FlexColumn>{children}</FlexColumn>
    </FlexColumn>
  )
}

export { AsideCategory }
