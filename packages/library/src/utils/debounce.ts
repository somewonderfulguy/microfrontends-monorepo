import { AnyFunctionType } from 'types/common'

const debounce = <TFunc extends AnyFunctionType>(
  func: TFunc,
  delay = 0
): ((...args: Parameters<TFunc>) => void) => {
  let timer: ReturnType<typeof setTimeout> | null = null

  return function (...args: Parameters<TFunc>) {
    timer && clearTimeout(timer)
    timer = setTimeout(() => func(args), delay)
  }
}

export default debounce
