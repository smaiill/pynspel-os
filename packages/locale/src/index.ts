import { IKeys } from './keys'
import { ITranslations, translations } from './translations'

export interface IOptions {
  /**
   * If it should `en` as default language, if any error with ur language.
   */
  defaultIfNotExists?: boolean
  /**
   * The language.
   */
  language: ITranslations
}

export type IOverridedOptions = Required<IOptions>

type Trim<T extends string> = T extends ` ${infer R}`
  ? Trim<R>
  : T extends `${infer L} `
  ? Trim<L>
  : T

type ExtractTranslationParams<T extends string> =
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  T extends `${infer _Start}{{${infer Param}}}${infer Rest}`
    ? {
        [K in Trim<Extract<Param, string>>]: string
      } & ExtractTranslationParams<Rest>
    : unknown

type ExtractTranslationParamsFromKey<
  T extends string,
  V extends keyof typeof translations = 'en'
> = T extends IKeys
  ? ExtractTranslationParams<(typeof translations)[V][T]> extends infer Params
    ? Params extends object
      ? {
          [K in keyof Params]: Params[K] extends string ? Params[K] : never
        }
      : never
    : never
  : unknown

export const defaultOptions = {
  language: 'en',
  defaultIfNotExists: false,
} as IOverridedOptions

class Translations {
  private options: IOptions
  private readonly REGEX: RegExp

  constructor() {
    this.options = { language: 'en' }
    this.REGEX = new RegExp('{{\\s*(\\w+)\\s*}}', 'g')
  }

  public init(options: IOptions): void {
    const newOptions = this.overrideOptions(options)
    this.options = newOptions
  }

  private overrideOptions(options: IOptions): IOptions {
    const newOptions = Object.assign({}, defaultOptions, options)
    return newOptions
  }

  public t<T extends IKeys>(
    key: T,
    ..._arguments: ExtractTranslationParamsFromKey<
      T,
      ITranslations
    > extends never
      ? [undefined?]
      : [ExtractTranslationParamsFromKey<T, ITranslations>]
  ): string {
    if (!this.options.language) {
      throw new Error('Invalid language, you need to initialize first.')
    }

    const value = this.findValue(key)
    const valueWithArgs = this.assignParams(value, _arguments)

    return valueWithArgs
  }

  private findValue(key: IKeys): string {
    const defaultIfNotExists = this.options.defaultIfNotExists
    let res = ''

    const value = translations[this.options.language as ITranslations][key]
    res = value

    if (!res && defaultIfNotExists) {
      const fallbackValue = translations[this.options.language][key]

      if (!fallbackValue) {
        return ''
      }

      return fallbackValue
    }

    return res
  }

  private assignParams(value: string, _arguments?: any): string {
    if (
      value.length === 0 ||
      !_arguments ||
      Object.getOwnPropertyNames(_arguments).length === 0
    ) {
      return value
    }

    const newValue = value.replace(this.REGEX, (_, key) => _arguments[key])
    return newValue
  }
}

const translationsInstance = new Translations()
const t = translationsInstance.t.bind(translationsInstance)

export { t, translationsInstance as Translations }
