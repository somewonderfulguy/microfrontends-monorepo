import { throttle } from '..'

test('throttle works', async () => {
  let i = 0
  let k = 0
  const spyObject = {
    fnToThrottleOne: () => {
      i++
      return i
    },
    fnToThrottleTwo: () => {
      k++
      return k
    }
  }
  jest.spyOn(spyObject, 'fnToThrottleOne')
  jest.spyOn(spyObject, 'fnToThrottleTwo')

  // single call, without delay paramether and generic
  const throttledFnOne = throttle(spyObject.fnToThrottleOne)
  expect(throttledFnOne()).toBe(1)
  expect(spyObject.fnToThrottleOne).toHaveBeenCalledTimes(1)
  
  // multiple calls with delay executes function only once
  const throttledFnTwo = throttle(spyObject.fnToThrottleTwo, 200)
  throttledFnTwo()
  throttledFnTwo()
  throttledFnTwo()
  expect(throttledFnTwo()).toBe(1)
  expect(spyObject.fnToThrottleTwo).toHaveBeenCalledTimes(1)
  await new Promise(r => setTimeout(r, 200))
  expect(throttledFnTwo()).toBe(2)
  expect(spyObject.fnToThrottleTwo).toHaveBeenCalledTimes(2)
})