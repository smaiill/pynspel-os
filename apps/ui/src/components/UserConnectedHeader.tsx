import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { useUserService } from '~/hooks/useUserService'
import { css } from '../../styled-system/css'

const styles = css({
  pos: 'relative',

  '& img': {
    rounded: '50%',
  },

  '& ul': {
    translate: '-50% -50%',
    pos: 'absolute',
    width: '150px',
    textAlign: 'center',
    left: '50%',
    bottom: '-75px',
    padding: '10px',
    rounded: '5px',
    bg: '#1f1f1f',
    border: '1px solid #2e2f30',
  },

  '& .logout': {
    color: 'red',
  },
})

const UserConnectedHeader = () => {
  const [open, setOpen] = useState(false)
  const { handleLogout } = useUserService()
  const containerRef = useRef(null)

  const toggleVisibility = () => {
    setOpen((prevV) => !prevV)
  }

  const handleClose = () => {
    setOpen(false) // Ferme le menu
  }

  const handleOutsideClick = (event) => {
    if (containerRef.current && !containerRef.current.contains(event.target)) {
      handleClose()
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick)
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
    }
  }, [])

  return (
    <div ref={containerRef} className={styles}>
      <Image
        onClick={toggleVisibility}
        src={
          'https://cdn.discordapp.com/avatars/504227742678646784/dd5bf03cf11d79ecbe51088cfde42940.png?size=1024'
        }
        alt="profile-image"
        height={45}
        width={45}
      />

      {open ? (
        <ul>
          <li onClick={handleLogout} className="logout">
            Se déconnecter
          </li>
        </ul>
      ) : null}
    </div>
  )
}

export default UserConnectedHeader
