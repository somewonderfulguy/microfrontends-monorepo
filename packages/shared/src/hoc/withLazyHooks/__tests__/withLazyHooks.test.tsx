import React from 'react'
import { FallbackProps } from 'react-error-boundary'

import { render, screen, userEvent, waitForElementToBeRemoved, mockConsole, checkConsoleLogging, clearConsoleMocks, SpyConsoles } from '../../../tests'

import { withLazyHooks } from '..'
import {
  TestComponentSingleHook as TestComponentSingleHookImpl, TestComponentMultipleHooks as TestComponentMultipleHooksImpl, errorMsg
} from './TestComponents'
import { hookOneResult } from './testHooks/useTestHookOne'
import { hookTwoResult } from './testHooks/useTestHookTwo'

const errorRegexp = /federated hook\(s\) failed/gi

const checkPromiseErrorLogging = ({ consoleError, consoleLog, consoleDir, isErrorAsString }: SpyConsoles & { isErrorAsString: boolean }) => {
  expect(consoleError).toHaveBeenCalledTimes(1)
  if (isErrorAsString) {
    expect(consoleError.mock.calls[0][0]).toMatch(new RegExp(errorMsg, 'i'))
  } else {
    expect(consoleError.mock.calls[0][0].message).toMatch(new RegExp(errorMsg, 'i'))
  }
  expect(consoleLog).toHaveBeenCalledTimes(1)
  expect(consoleLog.mock.lastCall[0]).toMatch(errorRegexp)
  expect(consoleDir).toHaveBeenCalledTimes(1)
  expect(consoleDir.mock.calls[0][0].toString()).toBe(`Error: ${errorMsg}`)
}

const testErrorCase = async (isCustomError = false) => {
  // mock console methods
  const { consoleDir, consoleError, consoleLog } = mockConsole()

  const TestComponentSingleHook = withLazyHooks({
    hooks: { useTestHookOne: import('./testHooks/useTestHookOne') },
    Component: TestComponentSingleHookImpl,
    Fallback: isCustomError
      ? ({ error, resetErrorBoundary }: FallbackProps) => (
        <div>
          <div role="alert">{error.message}</div>
          <button onClick={resetErrorBoundary}>reset</button>
        </div>
      )
      : undefined
  })

  const { container, rerender } = render(<TestComponentSingleHook withError />)
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
  // reset by click
  userEvent.click(screen.getByText(/reset/i, { selector: 'button' }))
  rerender(<TestComponentSingleHook />)
  // error message disappears
  await waitForElementToBeRemoved(getErrorElement)
  // loader returns
  const newLoader = container.querySelector('[aria-busy="true"]')
  expect(newLoader).toBeInTheDocument()
  // loader disappeared
  await waitForElementToBeRemoved(newLoader)
  // component successfully re-rendered without errors
  expect(screen.getByText(hookOneResult)).toBeInTheDocument()

  // check console logging
  checkConsoleLogging({ consoleError, consoleDir, consoleLog, errorMsg, componentName: 'TestComponentSingleHook', expectedPattern: errorRegexp })

  // restore console methods
  clearConsoleMocks({ consoleError, consoleDir, consoleLog })
}

const testErrorPromiseCase = async (isCustomError = false, isErrorAsString = false) => {
  // mock console methods
  const { consoleDir, consoleError, consoleLog } = mockConsole()

  const getTestComponentSingleHook = (withLoadingError = false) => withLazyHooks({
    hooks: { useTestHookOne: withLoadingError ? Promise.reject(isErrorAsString ? errorMsg : new Error(errorMsg)) : import('./testHooks/useTestHookOne') },
    Component: TestComponentSingleHookImpl,
    Fallback: isCustomError
      ? ({ error, resetErrorBoundary }: FallbackProps) => (
        <div>
          <div role="alert">{error.message}</div>
          <button onClick={resetErrorBoundary}>reset</button>
        </div>
      )
      : undefined
  })
  const TestComponentSingleHook = getTestComponentSingleHook(true)

  const { container, rerender } = render(<TestComponentSingleHook />)
  const loader = container.querySelector('[aria-busy="true"]')
  const getErrorElement = () => screen.getByText(errorMsg)

  // loader exist
  expect(loader).toBeInTheDocument()
  // component doesn't exist yet
  expect(screen.queryByText(hookOneResult)).not.toBeInTheDocument()
  // loader disappeared
  await waitForElementToBeRemoved(loader)
  // error message appeared
  expect(getErrorElement()).toBeInTheDocument()
  // reset by click
  userEvent.click(screen.getByText(/reset/i, { selector: 'button' }))
  const TestComponentSingleHookCorrect = getTestComponentSingleHook()
  rerender(<TestComponentSingleHookCorrect />)
  // error message disappears
  expect(screen.queryByText(errorMsg)).not.toBeInTheDocument()
  // loader returns
  const newLoader = container.querySelector('[aria-busy="true"]')
  expect(newLoader).toBeInTheDocument()
  // loader disappeared
  await waitForElementToBeRemoved(newLoader)
  // component successfully re-rendered without errors
  expect(screen.getByText(hookOneResult)).toBeInTheDocument()

  // check console logging
  checkPromiseErrorLogging({ consoleError, consoleDir, consoleLog, isErrorAsString })

  // restore console methods
  clearConsoleMocks({ consoleError, consoleDir, consoleLog })
}

test('minimal configuration', async () => {
  const TestComponentSingleHook = withLazyHooks({
    hooks: { useTestHookOne: import('./testHooks/useTestHookOne') },
    Component: TestComponentSingleHookImpl
  })

  const { container } = render(<TestComponentSingleHook />)
  const loader = container.querySelector('[aria-busy="true"]')

  // loader exist
  expect(loader).toBeInTheDocument()
  // component doesn't exist yet
  expect(screen.queryByText(hookOneResult)).not.toBeInTheDocument()
  // loader disappeared
  await waitForElementToBeRemoved(loader)
  // component appeared
  expect(screen.getByText(hookOneResult)).toBeInTheDocument()
})

test('custom loader', async () => {
  const loadingMsg = 'Loading...'
  const TestComponentSingleHook = withLazyHooks({
    hooks: { useTestHookOne: import('./testHooks/useTestHookOne') },
    Component: TestComponentSingleHookImpl,
    delayedElement: <>{loadingMsg}</>
  })
  render(<TestComponentSingleHook />)
  const getLoader = () => screen.getByText(loadingMsg)

  // loader exist
  expect(getLoader()).toBeInTheDocument()
  // component doesn't exist yet
  expect(screen.queryByText(hookOneResult)).not.toBeInTheDocument()
  // loader disappeared
  await waitForElementToBeRemoved(getLoader)
  // component appeared
  expect(screen.getByText(hookOneResult)).toBeInTheDocument()
})

test('multiple hooks', async () => {
  const TestComponentSingleHook = withLazyHooks({
    hooks: {
      useTestHookOne: import('./testHooks/useTestHookOne'),
      useTestHookTwo: import('./testHooks/useTestHookTwo')
    },
    Component: TestComponentMultipleHooksImpl
  })

  const { container } = render(<TestComponentSingleHook />)
  const loader = container.querySelector('[aria-busy="true"]')

  // loader exist
  expect(loader).toBeInTheDocument()
  // component doesn't exist yet
  expect(screen.queryByText(hookOneResult)).not.toBeInTheDocument()
  expect(screen.queryByText(hookTwoResult)).not.toBeInTheDocument()
  // loader disappeared
  await waitForElementToBeRemoved(loader)
  // component appeared
  expect(screen.getByText(hookOneResult)).toBeInTheDocument()
  expect(screen.getByText(hookTwoResult)).toBeInTheDocument()
})

// eslint-disable-next-line jest/expect-expect
test('error in hook & reset', async () => {
  await testErrorCase()
})

// eslint-disable-next-line jest/expect-expect
test('custom error fallback (for hook crushed) & reset', async () => {
  await testErrorCase(true)
})

// eslint-disable-next-line jest/expect-expect
test('error in loader (promise) & reset', async () => {
  await testErrorPromiseCase()
})

// eslint-disable-next-line jest/expect-expect
test('custom error fallback (for loader) & reset', async () => {
  await testErrorPromiseCase(true, true)
})

test.todo('custom query key with accessing query client')