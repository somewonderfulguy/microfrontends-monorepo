import { formatFiat } from '../formatUtils'

const number = 12345624.78934534

test('formatFiat', () => {
  const result = [
    formatFiat(number, 'usd'),
    formatFiat(number, 'eur'),
    formatFiat(number, 'uah'),
    formatFiat(number, 'gbp'),
    formatFiat(number, 'pln'),
    formatFiat(number, 'jpy')
  ]
  expect(result).toMatchSnapshot()
})
