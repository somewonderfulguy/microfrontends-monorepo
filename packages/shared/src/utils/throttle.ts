import { AnyArrayType, AnyFunctionType } from '../typesShared'

export const throttle = (func: AnyFunctionType, delay = 0) => {
  let isThrottled = false
  let savedArgs: AnyArrayType | null

  const wrapper = (...args: AnyArrayType) => {
    if (isThrottled) {
      savedArgs = args
      return
    }

    func(...args)
    isThrottled = true

    setTimeout(() => {
      isThrottled = false
      if (savedArgs) {
        wrapper(savedArgs)
        savedArgs = null
      }
    }, delay)
  }

  return wrapper
}