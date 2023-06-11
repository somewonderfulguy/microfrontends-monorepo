import { getIntNumber } from './getIntNumber'

export const fibonacciFor = (n: number) => {
  const [num] = getIntNumber(n)

  let a = 0
  let b = 1

  for (let i = 0; i < num - 3; i++) {
    const temp = a + b
    a = b
    b = temp
  }

  return a + b
}
