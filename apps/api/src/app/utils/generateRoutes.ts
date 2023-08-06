export const generatedRoutes: {
  routeName: string
  _args: string[]
  method: string
  path: string
}[] = []

const generateEndpoint = (httpMethod: string, routePath: string) => {
  const cleanedRoutePath = routePath.replace(/^\/|\/$/g, '')
  const _args: string[] = []

  const pathSegments = cleanedRoutePath
    .split('/')
    .filter((e) => e !== 'api')
    .filter((e) => e !== 'dashboard')

  const toCamelCase = (segment: string) => {
    if (segment.startsWith(':')) {
      const segementWithoutDots = segment.slice(1, segment.length)
      _args.push(segementWithoutDots)
      const letter = segementWithoutDots.charAt(0).toUpperCase()

      return `${letter}${segementWithoutDots.slice(
        1,
        segementWithoutDots.length
      )}`
    }

    const letter = segment.charAt(0).toUpperCase()

    return `${letter}${segment.slice(1, segment.length)}`
  }

  const capitalizedSegments = pathSegments.map(toCamelCase)
  const formatedOnes = capitalizedSegments.map((segment: string) => {
    const splited = segment.split('-')

    const camelCased = splited.map(toCamelCase)
    return camelCased.join('')
  })

  const routeName = httpMethod.toLowerCase() + formatedOnes.join('')

  return {
    routeName,
    _args,
  }
}

export const handleGenerateRoutes = (path: any, layer: any) => {
  if (layer.route) {
    layer.route.stack.forEach(
      handleGenerateRoutes.bind(null, path.concat(split(layer.route.path)))
    )
  } else if (layer.name === 'router' && layer.handle.stack) {
    layer.handle.stack.forEach(
      handleGenerateRoutes.bind(null, path.concat(split(layer.regexp)))
    )
  } else if (layer.method) {
    const endpointPath = path
      .concat(split(layer.regexp))
      .filter(Boolean)
      .join('/')
    const { routeName, _args } = generateEndpoint(layer.method, endpointPath)
    generatedRoutes.push({
      routeName,
      _args,
      method: layer.method.toUpperCase(),
      path: endpointPath,
    })
  }
}

const split = (thing: any) => {
  if (typeof thing === 'string') {
    return thing.split('/')
  } else if (thing.fast_slash) {
    return ''
  } else {
    const match = thing
      .toString()
      .replace('\\/?', '')
      .replace('(?=\\/|$)', '$')
      .match(/^\/\^((?:\\[.*+?^${}()|[\]\\/]|[^.*+?^${}()|[\]\\/])*)\$\//)
    return match
      ? match[1].replace(/\\(.)/g, '$1').split('/')
      : '<complex:' + thing.toString() + '>'
  }
}
