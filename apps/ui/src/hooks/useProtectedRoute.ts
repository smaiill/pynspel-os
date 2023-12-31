import { useRouter } from 'next/navigation'
import { useLayoutEffect } from 'react'
import { useUserValue } from '~/proxys/user'

export const useProtectedRoute = () => {
  const user = useUserValue()
  const router = useRouter()

  useLayoutEffect(() => {
    if (!user?.id) {
      return router.push(`/?error=E_UNAUTHORIZED`)
    }
  }, [user])
}
