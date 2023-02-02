import { AnyArrayType, AnyFunctionType } from '../typesShared'

const throttle = <T = AnyFunctionType>(func: AnyFunctionType, delay = 0) => {
  let isThrottled = false
  let savedArgs: AnyArrayType | null
  let result: ReturnType<typeof func>

  const wrapper = (...args: AnyArrayType) => {
    if (isThrottled) {
      savedArgs = args
      return result
    }

    setTimeout(() => {
      isThrottled = false
      if (savedArgs) {
        wrapper(savedArgs)
        savedArgs = null
      }
    }, delay)

    isThrottled = true
    result = func(...args)
    return result
  }

  return wrapper as T
}

export default throttle