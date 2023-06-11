import { getIntNumber } from './getIntNumber'

const fibonacciMap = new Map()

export const fibonacciMemo = (n: number): number => {
  const [num, isInvalid] = getIntNumber(n)

  const memoized = fibonacciMap.get(num)
  if (memoized) return memoized
  if (num === 1 || isInvalid) return 0
  if (num < 3) return 1

  const returnValue = fibonacciMemo(num - 1) + fibonacciMemo(num - 2)
  fibonacciMap.set(num, returnValue)
  return returnValue
}
