// TODO: implement local storage observer (or any other object observer) using Proxy.
// Example: https://github.com/bcomnes/local-storage-proxy/blob/master/cjs/index.js
// Where to learn: https://javascript.info/proxy
const objectObserver = (
  object: Record<string, unknown>,
  methods: string[],
  callbackBefore: (...args: unknown[]) => void = () => {},
  callbackAfter: (...args: unknown[]) => void = () => {}
) => {
  for (const method of methods) {
    const original = object[method]
    if (typeof original !== 'function') {
      console.warn(`Method ${method} is not a function`)
      continue
    }
    const originalMethod = original.bind(object)
    const newMethod = (...args: unknown[]) => {
      callbackBefore(method, ...args)
      const result = originalMethod(...args)
      callbackAfter(method, ...args)
      return result
    }
    object[method] = newMethod.bind(object)
  }
}

export default objectObserver
