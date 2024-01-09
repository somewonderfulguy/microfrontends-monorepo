// eslint-disable-next-line
type AnyFunctionType = (...args: any[]) => any

const throttle = <T extends AnyFunctionType>(
  func: T,
  delay = 0
): ((...args: Parameters<T>) => ReturnType<T>) => {
  let isThrottled = false
  let savedArgs: Parameters<T> | null = null
  let result: ReturnType<typeof func>
  let timer: ReturnType<typeof setTimeout> | null = null

  const wrapper = (...args: Parameters<T>): ReturnType<T> => {
    if (isThrottled) {
      savedArgs = args
      return result
    }

    timer && clearTimeout(timer)
    timer = setTimeout(() => {
      isThrottled = false
      if (savedArgs) {
        wrapper(...savedArgs)
        savedArgs = null
      }
    }, delay)

    isThrottled = true
    result = func(...args)
    return result
  }

  return wrapper
}

export default throttle
