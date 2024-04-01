import {
  useRef,
  createContext,
  useContext,
  useCallback,
  useSyncExternalStore,
  ReactNode
} from 'react'

// TODO: Add SSR support

/**
 * @typedef {Object} ReturnValue
 * @property {React.FC} Provider - React component that wraps the children and provides the store (has internally two context providers; one for the store value and one for the store dispatch)
 * @property {function} useStoreValue - hook that returns the store value
 * @property {function} useStoreDispatch - hook that returns the store dispatch function
 */

/**
 * Function that creates store and shares via React context. Optimized for re-rendering only those components that depend on the specific part of the store (using selectors).
 * Uses two contexts internally - one for the store value and one for the store dispatch.
 * For avoiding unnecessary re-renders, it uses `useSyncExternalStore` + `useRef`.
 * @param {TStore} initialState - initial state of the store
 * @param {string|undefined} displayName - optional display name for the Provider component (will be displayed in React DevTools)
 *
 * @returns {ReturnValue} object with Provider, useStoreValue and useStoreDispatch
 * */
const createContextStore = <TStore,>(
  initialState: TStore,
  displayName?: string
) => {
  type PrevStateFnUpdate = (prevValue: TStore) => TStore
  const useStoreData = (): {
    get: () => TStore
    set: (value: Partial<TStore> | PrevStateFnUpdate) => void
    subscribe: (callback: () => void) => () => void
  } => {
    const store = useRef(initialState)

    const get = useCallback(() => store.current, [])

    const subscribers = useRef(new Set<() => void>())

    const set = useCallback((value: Partial<TStore> | PrevStateFnUpdate) => {
      if (typeof value === 'function') {
        store.current = value(store.current)
      } else if (typeof value !== 'object') {
        store.current = value as TStore
      } else {
        store.current = { ...store.current, ...value }
      }
      subscribers.current.forEach((callback) => callback())
    }, [])

    const subscribe = useCallback((callback: () => void) => {
      subscribers.current.add(callback)
      return () => subscribers.current.delete(callback)
    }, [])

    return {
      get,
      set,
      subscribe
    }
  }

  type UseStoreDataReturnType = ReturnType<typeof useStoreData>

  const StoreValueContext = createContext<
    Omit<UseStoreDataReturnType, 'set'> | undefined
  >(undefined)
  const StoreDispatchContext = createContext<
    UseStoreDataReturnType['set'] | undefined
  >(undefined)

  const Provider = ({ children }: { children: ReactNode }) => {
    const { get, set, subscribe } = useStoreData()
    return (
      <StoreDispatchContext.Provider value={set}>
        <StoreValueContext.Provider value={{ get, subscribe }}>
          {children}
        </StoreValueContext.Provider>
      </StoreDispatchContext.Provider>
    )
  }
  if (displayName) Provider.displayName = displayName

  /**
   * @param {function} selector - function that selects the part of the store, e.g. `(store) => store.someValue`
   * @returns {*} selected part of the store
   */
  const useStoreValue = <SelectorOutput,>(
    selector: (store: TStore) => SelectorOutput
  ): SelectorOutput => {
    const store = useContext(StoreValueContext)
    if (store === undefined) {
      throw new Error(
        'useStoreValue must be used inside a Provider with a value'
      )
    }

    return useSyncExternalStore(
      store.subscribe,
      () => selector(store.get()),
      () => selector(initialState)
    )
  }

  /**
   * @returns {function} function that updates the store function accepts either partial store (e.g. `{ someValue: 'new value' }`) or function that accepts previous store value and returns new store value (e.g. `(prevStore) => ({ ...prevStore, someValue: 'new value' }`)
   */
  const useStoreDispatch = () => {
    const set = useContext(StoreDispatchContext)
    if (set === undefined) {
      throw new Error(
        'useStoreDispatch must be used inside a Provider with a value'
      )
    }
    return set
  }

  return {
    Provider,
    useStoreValue,
    useStoreDispatch
  }
}

export default createContextStore
