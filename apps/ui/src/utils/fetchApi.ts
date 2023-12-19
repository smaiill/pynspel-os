import { API_URL } from '~/constants'

export const fetchApi = async <T = unknown>(
  uri: string,
  options?: RequestInit
) => {
  const res = await fetch(`${API_URL}${uri}`, {
    ...options,
    credentials: 'include',
    headers: {
      ...options?.headers,
      'Content-Type': 'application/json',
    },
  })

  const _json = await res.json()

  if (!res.ok) {
    throw new Error(_json.code)
  }

  return _json as T
}
