/**
 * HOC that takes a Component and array of lazy loaded hooks and wraps it in ErrorBoundary. Loaded hooks will be injected as props.
 *
 * hooks prop: { [key: string]: () => Promise<any> } -- required, will be injected as props to the component.
 *
 * As loader, `delayedElement` can be passed - if no passed then empty <div aria-busy="true" /> will be displayed.
 *
 * Fallback prop will be used if lazily loaded component failed. If no Fallback provided, the default fallback will be used.
 * Default fallback outputs error and reset button. The reset works through key prop that re-renders component completely.
 *
 * Ref forwarding is supported.
 *
 * Examples of usage:
 *
 * 1) Minimal configuration:
 *
 * type HooksType = { usePrevious: usePreviousHook }
 *
 * const ExampleComponent = (({ usePrevious }: HooksType) => {
 *   // ... component implementation ...
 * })
 *
 * const ExampleComponentWrapped = withLazyHooks<HooksType>({
 *   hooks: { usePrevious: import('path/to/usePrevious') },
 * })(ExampleComponent)
 *
 * ------------------------------------------------------------
 *
 * 2) Full configuration (all props & ref):
 *
 * type PropType = { exampleProp: string }
 *
 * type HooksType = {
 *   usePrevious: usePreviousHook
 *   useResizeObserver: useResizeObserverHook
 * }
 *
 * type RefType = { log: () => void }
 *
 * const ExampleComponentWithRef = forwardRef((({ usePrevious, exampleProp }: PropType & HooksType, ref) => {
 *   useImperativeHandle(ref, () => ({ log: () => console.log('logging...') }))
 *   // ... component implementation ...
 * }))
 * ExampleComponentWithRef.displayName = 'ExampleComponentWithRef'
 *
 * const ExampleComponentWrapped = withLazyHooks<HooksType, PropType, RefType>({
 *   hooks: {
 *     usePrevious: import('library/build-npm/hooks/usePrevious'),
 *     useResizeObserver: import('library/build-npm/hooks/useResizeObserver')
 *   },
 *   delayedElement: <div>Please wait, loading...</div>,
 *   Fallback: ({ error, resetErrorBoundary, ...props }: FallbackProps & Props) => (
 *     <div>
 *       Custom fallback,{' '}
 *       <button onClick={resetErrorBoundary}>try to reset</button>
 *       <br />
 *       Error: {error.message}
 *       <br />
 *       Props: exampleProp = {props.exampleProp}
 *     </div>
 *   )
 * })(ExampleComponent)
 */

import {
  ComponentType,
  forwardRef,
  ReactNode,
  useEffect,
  useRef,
  useCallback,
  useState
} from 'react'
import {
  ErrorBoundary as ReactErrorBoundary,
  FallbackProps
} from 'react-error-boundary'

import {
  DefaultFallbackComponent,
  errorHandler,
  ResetWrapper
} from '../federatedShared'
import { HOCRefComponent } from '../types'

// when lazily do import('useHook'), this module will be asynchonously loaded under default property
type LazifyHooks<T> = {
  [K in keyof T]: Promise<{ default: T[K] }>
}

// Promise.all(hooks) will return Array<{ default: typeof hook }>
type SetDefaultKey<T> = {
  [K in keyof T]: { default: T[K] }
}[keyof T]

type CommonProps<THooks> = {
  hooks: LazifyHooks<THooks>
  delayedElement?: ReactNode
}

type LoadingWrapperProps<THooks> = CommonProps<THooks> & {
  render: (loadedHooks: SetDefaultKey<THooks>[]) => ReactNode
  renderFallback: (error: Error, refetch: () => void) => JSX.Element
}

type WithLazyHooksProps<THooks, TProps> = CommonProps<THooks> & {
  Fallback?: ComponentType<FallbackProps & TProps>
}

const errorMessage = 'Federated hook(s) failed!'

function LoadingWrapper<THooks>({
  hooks,
  render,
  renderFallback,
  delayedElement
}: LoadingWrapperProps<THooks>) {
  type LoadedHooks = SetDefaultKey<THooks>[]
  const [loadedHooks, setLoadedHooks] = useState<LoadedHooks>([])

  const [isLoading, setIsLoading] = useState(true)
  const [error, setIsError] = useState<Error | null>(null)
  const isError = error !== null

  const fetchHooks = useCallback(() => {
    setIsLoading(true)
    return Promise.all(Object.values(hooks))
      .then((result: unknown) => {
        setIsLoading(false)
        setIsError(null)
        return result as LoadedHooks
      })
      .catch((error) => {
        setIsLoading(false)
        setIsError(error)
        errorHandler(error, { errorMessage })
        return []
      })
  }, [hooks])

  const initialized = useRef(false)
  useEffect(() => {
    if (initialized.current) return
    fetchHooks().then((hooks) => {
      setLoadedHooks(hooks)
      initialized.current = true
    })
  }, [fetchHooks])

  const loader = <>{delayedElement ?? <div aria-busy="true" />}</>
  const renderWithHooks = (hooks?: LoadedHooks) => <>{hooks && render(hooks)}</>

  if (isLoading) return loader

  if (isError) {
    const errorObj = error?.message
      ? error
      : new Error(
          typeof error === 'string'
            ? error
            : /* istanbul ignore next */ 'Unknown error on federated hooks loading'
        )

    errorHandler(errorObj, { errorMessage })

    return <>{renderFallback(errorObj, fetchHooks)}</>
  }

  return renderWithHooks(loadedHooks)
}

export const withLazyHooks = <
  THooks,
  TProps extends object = Record<string, unknown>,
  TRef extends object = Record<string, unknown>
>({
  hooks,
  Fallback,
  ...rest
}: WithLazyHooksProps<THooks, TProps>) => {
  const renderFallback = (fallbackProps: FallbackProps & TProps) =>
    Fallback ? (
      <Fallback {...(fallbackProps as FallbackProps & TProps)} />
    ) : (
      <DefaultFallbackComponent {...fallbackProps}>
        {errorMessage}
      </DefaultFallbackComponent>
    )

  return (
    WrappedComponent: ComponentType<TProps & THooks>
  ): HOCRefComponent<TRef, TProps> => {
    const ReturnComponent = forwardRef<TRef, TProps>(
      (props: TProps, ref): JSX.Element => (
        <ResetWrapper
          render={(resetComponent) => (
            <ReactErrorBoundary
              fallbackRender={(errorProps) => {
                const fallbackProps = {
                  ...errorProps,
                  ...props,
                  resetErrorBoundary: resetComponent
                }
                return renderFallback(fallbackProps)
              }}
              onError={(error, info) =>
                errorHandler(error, { ...info, errorMessage })
              }
            >
              <LoadingWrapper<THooks>
                hooks={hooks}
                render={(loadedHooks) => {
                  const hookNames = Object.keys(hooks)
                  const hooksToProps = hookNames.reduce(
                    (acc, name, idx) =>
                      // TODO: check if default property exists and throw error if not
                      ({ ...acc, [name]: loadedHooks[idx].default }),
                    {} as THooks
                  )

                  return (
                    <WrappedComponent
                      {...{ ...props, ...hooksToProps }}
                      ref={ref}
                    />
                  )
                }}
                renderFallback={(error, refetch) =>
                  renderFallback({
                    error,
                    resetErrorBoundary: refetch,
                    ...props
                  })
                }
                {...rest}
              />
            </ReactErrorBoundary>
          )}
        />
      )
    )

    ReturnComponent.displayName =
      WrappedComponent.name ??
      WrappedComponent.displayName ??
      'ComponentWithLazyHooks'

    return ReturnComponent
  }
}
