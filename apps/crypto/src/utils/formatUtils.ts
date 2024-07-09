import { FiatKey } from '../api/balance/balanceTypes'

const fiatToLocale = new Map<FiatKey, string>([
  ['usd', 'en-US'],
  ['uah', 'uk-UA'],
  ['gbp', 'en-GB'],
  ['eur', 'de-DE'],
  ['pln', 'pl-PL'],
  ['jpy', 'ja-JP']
])

export const formatFiat = (value: number, currency: FiatKey) =>
  new Intl.NumberFormat(fiatToLocale.get(currency), {
    style: 'currency',
    currency
  })
    .format(value)
    // if the currency symbol is at the end with space - move to the beginning
    .replace(/(.{1,})(\s€|₴)/, (match, p1, p2) => p2.trim() + p1.trim())
