import { getIntNumber } from './getIntNumber'

export const fibonacciRecursion = (n: number): number => {
  const [num, isInvalid] = getIntNumber(n)

  // TODO: verify
  if (num < 1 || isInvalid) return 0
  if (num < 3) return 1

  return fibonacciRecursion(num - 1) + fibonacciRecursion(num - 2)
}
