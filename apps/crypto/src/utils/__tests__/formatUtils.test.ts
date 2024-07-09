import { formatFiat } from '../formatUtils'

const number = 12345624.78934534
const numberAlt = 12345624

test('formatFiat', () => {
  const result = [
    formatFiat(number, 'usd'),
    formatFiat(numberAlt, 'usd'),
    formatFiat(number, 'eur'),
    formatFiat(numberAlt, 'eur'),
    formatFiat(number, 'uah'),
    formatFiat(numberAlt, 'uah'),
    formatFiat(number, 'gbp'),
    formatFiat(numberAlt, 'gbp'),
    formatFiat(number, 'pln'),
    formatFiat(numberAlt, 'pln'),
    formatFiat(number, 'jpy'),
    formatFiat(numberAlt, 'jpy')
  ]
  expect(result).toMatchSnapshot()
})
