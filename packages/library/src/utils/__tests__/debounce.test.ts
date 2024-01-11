import debounce from '../debounce'

test('debounce works', async () => {
  // fake data to test
  let counterOne = 0
  let counterTwo = 0

  const spyObject = {
    fnToDebounceOne: () => {
      counterOne++
      return counterOne
    },
    fnToDebounceTwo: () => {
      counterTwo++
      return counterTwo
    }
  }
  jest.spyOn(spyObject, 'fnToDebounceOne')
  jest.spyOn(spyObject, 'fnToDebounceTwo')

  // single call, without delay parameter
  expect(counterOne).toBe(0)
  expect(spyObject.fnToDebounceOne).toHaveBeenCalledTimes(0)
  const debouncedFnOne = debounce(spyObject.fnToDebounceOne)
  debouncedFnOne()
  await new Promise((r) => setTimeout(r))
  expect(counterOne).toBe(1)
  expect(spyObject.fnToDebounceOne).toHaveBeenCalledTimes(1)

  // multiple calls with delay executes function only once
  const debouncedFnTwo = debounce(spyObject.fnToDebounceTwo, 50)
  expect(counterTwo).toBe(0)
  debouncedFnTwo()
  debouncedFnTwo()
  debouncedFnTwo()
  debouncedFnTwo()
  expect(counterTwo).toBe(0)
  expect(spyObject.fnToDebounceTwo).toHaveBeenCalledTimes(0)
  await new Promise((r) => setTimeout(r, 50))
  expect(counterTwo).toBe(1)
  expect(spyObject.fnToDebounceTwo).toHaveBeenCalledTimes(1)

  // `this` context test using .bind
  class Counter {
    count = 0

    increment() {
      this.count++
    }
  }
  const counter = new Counter()
  const debouncedIncrement = debounce(counter.increment.bind(counter))

  setTimeout(() => debouncedIncrement())

  expect(counter.count).toBe(0)
  await new Promise((r) => setTimeout(r, 20))
  expect(counter.count).toBe(1)

  // TODO: test for calling with parameters (make sure that parameters are working correctly)
})
