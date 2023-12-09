export const accesToObjectKeyUsingPath = (
  path: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ob: Record<PropertyKey, any>
) => {
  const keys = path.split('.')
  let currentObject = ob

  for (const key of keys) {
    if (key in currentObject) {
      currentObject = currentObject[key]
    } else {
      return undefined
    }
  }

  return currentObject
}
