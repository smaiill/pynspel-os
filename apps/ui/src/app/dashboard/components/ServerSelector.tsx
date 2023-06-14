import Image from 'next/image'
import { BiChevronDown } from 'react-icons/bi'
import { Flex } from '~/layouts/Flex'
import style from './server.selector.module.scss'

const ServerSelector = () => {
  return (
    <div className={style.selector}>
      <Flex
        style={{
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Flex className={style.left}>
          <Image
            alt="server-image"
            width={30}
            height={30}
            // src={
            //   'https://cdn.discordapp.com/icons/816667805566500896/631b520785f83d9fa703df65ed2e1b07.jpg'
            // }
            src={''}
          />
          <span>NX</span>
        </Flex>
        <BiChevronDown />
      </Flex>
    </div>
  )
}

export default ServerSelector
