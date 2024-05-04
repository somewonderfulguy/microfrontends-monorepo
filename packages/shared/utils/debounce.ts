import { AnyFunctionType } from '~types/common'

const debounce = <TFunc extends AnyFunctionType>(
  func: TFunc,
  delay = 0
): { (...args: Parameters<TFunc>): void; cancel: () => void } => {
  let timer: ReturnType<typeof setTimeout> | null = null

  const clearTimer = () => {
    timer && clearTimeout(timer)
  }

  function debouncedFunction(...args: Parameters<TFunc>) {
    clearTimer()
    timer = setTimeout(() => func(args), delay)
  }

  debouncedFunction.cancel = clearTimer

  return debouncedFunction
}

export default debounce
