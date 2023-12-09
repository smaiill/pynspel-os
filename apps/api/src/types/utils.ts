type Separator = '.'

export type ObjectKeysPath<O, P extends string = ''> = O extends object
  ? {
      [K in keyof O]: ObjectKeysPath<
        O[K],
        `${P}${P extends '' ? '' : Separator}${string & K}`
      >
    }[keyof O]
  : P
