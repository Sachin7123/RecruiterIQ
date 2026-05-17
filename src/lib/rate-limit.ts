export const UPLOAD_RATE_LIMIT = 5
export const UPLOAD_COOKIE_NAME = "upload_count"
export const UPLOAD_COOKIE_MAX_AGE = 60 * 60

export function getCookieCount(cookieHeader: string | null, name: string): number {
  if (!cookieHeader) return 0
  const match = cookieHeader.match(new RegExp(`${name}=(\\d+)`))
  return match ? parseInt(match[1], 10) : 0
}
