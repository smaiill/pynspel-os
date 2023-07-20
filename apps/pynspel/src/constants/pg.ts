export const PgErrors = {
  UniqueViolation: '23505',
} as const

export type PgError = {
  code: string
}
