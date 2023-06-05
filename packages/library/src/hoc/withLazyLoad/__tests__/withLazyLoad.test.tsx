import React, { MutableRefObject, lazy, useRef } from 'react'
import { FallbackProps } from 'react-error-boundary'

import {
  render,
  screen,
  userEvent,
  waitForElementToBeRemoved,
  mockConsole,
  checkConsoleLogging,
  clearConsoleMocks
} from '../../../tests'

import { withLazyLoad } from '../withLazyLoad'
import { PropType, RefType, errorMsg, logMsg } from './TestComponent'

const successRenderMsg = 'success render'

const testErrorCase = async (isCustomError = false) => {
  // mock console methods
  const { consoleDir, consoleError, consoleLog } = mockConsole()

  const TestComponent = withLazyLoad<PropType>({
    Fallback: isCustomError
      ? ({ error, resetErrorBoundary }: FallbackProps) => (
          <div>
            <div role="alert">{error.message}</div>
            <button onClick={resetErrorBoundary}>reset</button>
          </div>
        )
      : undefined
  })(lazy(() => import('./TestComponent')))
  const { container, rerender } = render(
    <TestComponent withError>{successRenderMsg}</TestComponent>
  )
  const loader = container.querySelector('[aria-busy="true"]')
  const getErrorElement = () => screen.getByText(errorMsg)

  // loader exist
  expect(loader).toBeInTheDocument()
  // error message doesn't exist yet
  expect(screen.queryByText(errorMsg)).not.toBeInTheDocument()
  // loader disappeared
  await waitForElementToBeRemoved(loader)
  // error message appeared
  expect(getErrorElement()).toBeInTheDocument()
  // no component rendered
  expect(screen.queryByText(successRenderMsg)).not.toBeInTheDocument()
  // reset by click
  userEvent.click(screen.getByText(/reset/i, { selector: 'button' }))
  rerender(<TestComponent>{successRenderMsg}</TestComponent>)
  // error message disappears
  await waitForElementToBeRemoved(getErrorElement)
  // component successfully re-rendered without errors
  expect(screen.getByText(successRenderMsg)).toBeInTheDocument()
  // no error displayed
  expect(screen.queryByText(errorMsg)).not.toBeInTheDocument()

  // check console logging
  checkConsoleLogging({
    consoleError,
    consoleDir,
    consoleLog,
    errorMsg,
    componentName: 'TestComponent',
    expectedPattern: /component failed/gi
  })

  // restore console methods
  clearConsoleMocks({ consoleError, consoleDir, consoleLog })
}

test('minimal configuration', async () => {
  const TestComponent = withLazyLoad<PropType>()(
    lazy(() => import('./TestComponent'))
  )
  const { container } = render(
    <TestComponent>{successRenderMsg}</TestComponent>
  )
  const loader = container.querySelector('[aria-busy="true"]')

  // loader exist
  expect(loader).toBeInTheDocument()
  // component doesn't exist yet
  expect(screen.queryByText(successRenderMsg)).not.toBeInTheDocument()
  // loader disappeared
  await waitForElementToBeRemoved(loader)
  // component appeared
  expect(screen.getByText(successRenderMsg)).toBeInTheDocument()
})

test('custom loader', async () => {
  const loadingMsg = 'Loading...'
  const TestComponent = withLazyLoad<PropType>({
    delayedElement: <>{loadingMsg}</>
  })(lazy(() => import('./TestComponent')))
  render(<TestComponent>{successRenderMsg}</TestComponent>)
  const getLoader = () => screen.getByText(loadingMsg)

  // loader exist
  expect(getLoader()).toBeInTheDocument()
  // component doesn't exist yet
  expect(screen.queryByText(successRenderMsg)).not.toBeInTheDocument()
  // loader disappeared
  await waitForElementToBeRemoved(getLoader)
  // component appeared
  expect(screen.getByText(successRenderMsg)).toBeInTheDocument()
})

// eslint-disable-next-line jest/expect-expect
test('error & reset', async () => {
  await testErrorCase()
})

// eslint-disable-next-line jest/expect-expect
test('custom error fallback & reset', async () => {
  await testErrorCase(true)
})

test('withLazyLoad forwarding ref works', async () => {
  const TestComponent = withLazyLoad<PropType, RefType>()(
    lazy(() => import('./TestComponent'))
  )
  const TestComponentWrapper = () => {
    const ref = useRef<RefType>()
    return (
      <>
        <TestComponent ref={ref as MutableRefObject<RefType>} />
        <button type="button" onClick={() => ref.current?.log()}>
          click
        </button>
      </>
    )
  }

  render(<TestComponentWrapper />)
  expect(screen.getByRole('button')).toBeInTheDocument()

  const consoleLog = jest.spyOn(console, 'log').mockImplementation()
  await userEvent.click(screen.getByRole('button'))
  expect(consoleLog).toHaveBeenCalledWith(logMsg)
  consoleLog.mockRestore()
})
