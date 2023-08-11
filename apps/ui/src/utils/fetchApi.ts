import { API_URL } from '~/constants'

export const fetchApi = async <T = unknown>(
  uri: string,
  options?: RequestInit
) => {
  // throw new Error('Stop here !')

  const res = await fetch(`${API_URL}${uri}`, {
    ...options,
    credentials: 'include',
    headers: {
      ...options?.headers,
      'Content-Type': 'application/json',
    },
  })

  console.log(res)

  const _json = await res.json()

  if (!res.ok) {
    throw new Error(_json.error)
  }

  return _json as T
}
