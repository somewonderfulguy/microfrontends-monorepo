import { getIntNumber } from './getIntNumber'

export const fibonacciWhile = (n: number) => {
  let [num] = getIntNumber(n)

  let a = 0
  let b = 1

  while (num > 3) {
    const temp = a + b
    a = b
    b = temp
    num--
  }

  return a + b
}
