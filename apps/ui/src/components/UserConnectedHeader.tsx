import { useRouter } from 'next/navigation'
import { useRef, useState } from 'react'
import { useUserService } from '~/hooks/useUserService'
import { useUserValue } from '~/proxys/user'
import { getDefaultAvatar, getUserAvatar } from '~/utils/discord'
import { css } from '../../styled-system/css'
import { Dropdown } from './dropdown/Dropdown'

const styles = css({
  pos: 'relative',

  '& img': {
    rounded: '50%',
  },

  // '& ul': {
  // translate: '0% -50%',
  // pos: 'absolute',
  // width: '150px',
  // textAlign: 'center',
  // right: '0%',
  // bottom: '-75px',
  // padding: '10px',
  // rounded: '5px',
  // bg: '#1f1f1f',
  // border: '1px solid #2e2f30',
  // },

  // '& .logout': {
  //   color: 'red',
  // },
})

const UserConnectedHeader = () => {
  const [open, setOpen] = useState(false)
  const { handleLogout } = useUserService()
  const containerRef = useRef(null)
  const router = useRouter()
  const user = useUserValue()

  const toggleVisibility = () => {
    setOpen((prevV) => !prevV)
  }

  const logout = async () => {
    await handleLogout()

    router.push('/')
  }

  return (
    <div ref={containerRef} className={styles}>
      <img
        onClick={toggleVisibility}
        src={user ? getUserAvatar(user.id, user.avatar) : getDefaultAvatar(1)}
        alt="profile-image"
        height={45}
        width={45}
        className={css({ cursor: 'pointer' })}
      />
      {open ? (
        <Dropdown parentRef={containerRef} askClose={() => setOpen(false)}>
          <Dropdown.Item
            onClick={logout}
            className={css({ color: 'red.600 !important' })}
          >
            Se déconnecter
          </Dropdown.Item>
        </Dropdown>
      ) : null}
    </div>
  )
}

export default UserConnectedHeader
