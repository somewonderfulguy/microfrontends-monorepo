import React, { FunctionComponent, lazy } from 'react'
import { FallbackProps } from 'react-error-boundary'

import { render, screen, userEvent, waitForElementToBeRemoved } from '../../../tests'

import { federatedComponent } from '../federatedComponent'
import { IProps, errorMsg } from './TestComponent'

type ComponentType = FunctionComponent<IProps>

const successRenderMsg = 'success render'

const mockConsole = () => {
  const consoleError = jest.spyOn(console, 'error').mockImplementation()
  const consoleLog = jest.spyOn(console, 'log').mockImplementation()
  const consoleDir = jest.spyOn(console, 'dir').mockImplementation()

  return { consoleError, consoleLog, consoleDir }
}

type SpyConsoles = { consoleError: jest.SpyInstance, consoleLog: jest.SpyInstance, consoleDir: jest.SpyInstance }

const clearConsoleMocks = ({ consoleError, consoleLog, consoleDir }: SpyConsoles) => {
  consoleError.mockRestore()
  consoleLog.mockRestore()
  consoleDir.mockRestore()
}

const checkConsoleLogging = ({ consoleError, consoleLog, consoleDir }: SpyConsoles) => {
  expect(consoleError).toHaveBeenCalledTimes(2)
  expect(consoleError.mock.calls[0][0]).toMatch(new RegExp(errorMsg, 'i'))
  expect(consoleError.mock.calls[1][0]).toMatch(/The above error occurred in the <TestComponent> component/i)
  expect(consoleLog).toHaveBeenCalledTimes(1)
  expect(consoleLog.mock.lastCall[0]).toMatch(/federated module failed/gi)
  expect(consoleDir).toHaveBeenCalledTimes(2)
  expect(consoleDir.mock.calls[0][0].toString()).toBe(`Error: ${errorMsg}`)
  expect(consoleDir.mock.calls[1][0]).toMatch(/at TestComponent/)
}

test('minimal configuration', async () => {
  const TestComponent = federatedComponent<ComponentType>({
    Component: lazy(() => import('./TestComponent'))
  })
  const { container } = render(<TestComponent>{successRenderMsg}</TestComponent>)
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
  const TestComponent = federatedComponent<ComponentType>({
    Component: lazy(() => import('./TestComponent')),
    delayedElement: <>{loadingMsg}</>
  })
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

test('error & reset', async () => {
  // mock console methods
  const { consoleDir, consoleError, consoleLog } = mockConsole()

  const TestComponent = federatedComponent<ComponentType>({
    Component: lazy(() => import('./TestComponent'))
  })
  const { container, rerender } = render(<TestComponent withError>{successRenderMsg}</TestComponent>)
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
  rerender(<TestComponent>{successRenderMsg}</TestComponent>)
  // error message disappears
  await waitForElementToBeRemoved(getErrorElement)
  // component successfully re-rendered without errors
  expect(screen.getByText(successRenderMsg)).toBeInTheDocument()

  // check console logging
  checkConsoleLogging({ consoleError, consoleDir, consoleLog })

  // restore console methods
  clearConsoleMocks({ consoleError, consoleDir, consoleLog })
})

test('custom error fallback & reset', async () => {
  // mock console methods
  const { consoleDir, consoleError, consoleLog } = mockConsole()

  const TestComponent = federatedComponent<ComponentType>({
    Component: lazy(() => import('./TestComponent')),
    Fallback: ({ error, resetErrorBoundary }: FallbackProps) => (
      <div>
        <div role="alert">{error.message}</div>
        <button onClick={resetErrorBoundary}>reset</button>
      </div>
    )
  })
  const { container, rerender } = render(<TestComponent withError>{successRenderMsg}</TestComponent>)
  const loader = container.querySelector('[aria-busy="true"]')
  const getErrorElement = () => screen.getByText(errorMsg)

  // loader exist
  expect(loader).toBeInTheDocument()
  // error message doesn't exist yet
  expect(screen.queryByText(errorMsg)).not.toBeInTheDocument()
  // loader disappeared
  await waitForElementToBeRemoved(loader)
  // reset by click
  userEvent.click(screen.getByText(/reset/i, { selector: 'button' }))
  rerender(<TestComponent>{successRenderMsg}</TestComponent>)
  // error message disappears
  await waitForElementToBeRemoved(getErrorElement)
  // component successfully re-rendered without errors
  expect(screen.getByText(successRenderMsg)).toBeInTheDocument()

  // check console logging
  checkConsoleLogging({ consoleError, consoleDir, consoleLog })

  // restore console methods
  clearConsoleMocks({ consoleError, consoleDir, consoleLog })
})