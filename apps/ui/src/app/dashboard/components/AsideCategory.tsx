import { PropsWithChildren } from 'react'
import { BiChevronDown } from 'react-icons/bi'
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
          typography="p"
        >
          Gestion du serveur
        </Typography>
        <BiChevronDown />
      </Flex>
      <FlexColumn>{children}</FlexColumn>
    </FlexColumn>
  )
}

export { AsideCategory }
