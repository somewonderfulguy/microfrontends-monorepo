import { AnyFunctionType } from 'types/common'

const debounce = <T extends AnyFunctionType>(
  func: T,
  delay = 0
): ((...args: Parameters<T>) => void) => {
  let timer: ReturnType<typeof setTimeout> | null = null

  return function (...args: Parameters<T>) {
    timer && clearTimeout(timer)
    timer = setTimeout(() => func(args), delay)
  }
}

export default debounce
