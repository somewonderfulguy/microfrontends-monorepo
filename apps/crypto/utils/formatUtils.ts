import { FiatKey } from '../apiClient/balance/balanceTypes'

const fiatToLocale = new Map<FiatKey, string>([
  ['usd', 'en-US'],
  ['uah', 'uk-UA'],
  ['gbp', 'en-GB'],
  ['eur', 'de-DE'],
  ['pln', 'pl-PL'],
  ['jpy', 'ja-JP']
])

export const formatFiat = (
  value: number,
  currency: FiatKey,
  options?: Intl.NumberFormatOptions
) =>
  new Intl.NumberFormat(fiatToLocale.get(currency), {
    style: 'currency',
    currency,
    ['trailingZeroDisplay' as string]: 'stripIfInteger',
    ...options
  })
    .format(value)
    // if the currency symbol is at the end with space - move to the beginning
    .replace(/(.{1,})(\s€|₴)$/, (match, p1, p2) => p2.trim() + p1.trim())
