import debounce from '../debounce'

test('debounce single call without delay parameter works', async () => {
  let counter = 0
  const fnToDebounce = jest.fn(() => counter++)

  const debouncedFn = debounce(fnToDebounce)
  debouncedFn()
  await new Promise((r) => setTimeout(r))
  expect(counter).toBe(1)
  expect(fnToDebounce).toHaveBeenCalledTimes(1)
})

test('debounce multiple calls with delay parameter works', async () => {
  let counter = 0
  const fnToDebounce = jest.fn(() => counter++)

  const debouncedFn = debounce(fnToDebounce, 50)
  debouncedFn()
  debouncedFn()
  debouncedFn()
  debouncedFn()
  expect(counter).toBe(0)
  expect(fnToDebounce).toHaveBeenCalledTimes(0)
  await new Promise((r) => setTimeout(r, 50))
  expect(counter).toBe(1)
  expect(fnToDebounce).toHaveBeenCalledTimes(1)
})

test('debounce `this` context test using .bind', async () => {
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
})

test('debounce with parameters', async () => {
  const fnToDebounce = jest.fn((a: number, b: number) => {
    //
  })

  const debouncedFn = debounce(fnToDebounce, 50)
  debouncedFn(1, 5)
  expect(fnToDebounce).toHaveBeenCalledTimes(0)
  await new Promise((r) => setTimeout(r, 150))
  expect(fnToDebounce).toHaveBeenCalledTimes(1)
  expect(fnToDebounce).toHaveBeenCalledWith([1, 5])
})

test('should quit execution on `.cancel()` call', async () => {
  let counter = 0
  const fnToDebounce = jest.fn(() => counter++)

  const debouncedFn = debounce(fnToDebounce, 50)
  debouncedFn()
  debouncedFn.cancel()
  await new Promise((r) => setTimeout(r, 50))
  expect(counter).toBe(0)
  expect(fnToDebounce).toHaveBeenCalledTimes(0)
})
