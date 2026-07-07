export const PRODUCTION_URL = 'https://cvjobmatcher.com'
export const SITE_NAME = 'Fitted'

export function getBaseUrl(): string {
  return process.env.NEXT_PUBLIC_BASE_URL || PRODUCTION_URL
}

export function isProduction(): boolean {
  return getBaseUrl().replace(/\/$/, '') === PRODUCTION_URL
}
