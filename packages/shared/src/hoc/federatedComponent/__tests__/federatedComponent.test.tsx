import React, { FunctionComponent, lazy } from 'react'

import { render, screen, userEvent, waitForElementToBeRemoved } from '../../../tests'

import { federatedComponent } from '../federatedComponent'
import { IProps, errorMsg } from './TestComponent'

type ComponentType = FunctionComponent<IProps>

const successRenderMsg = 'success render'

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
  // mock console method
  const consoleError = jest.spyOn(console, 'error').mockImplementation()
  const consoleLog = jest.spyOn(console, 'log').mockImplementation()
  const consoleDir = jest.spyOn(console, 'dir').mockImplementation()

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
  rerender(<TestComponent>{successRenderMsg}</TestComponent>)
  userEvent.click(screen.getByText(/reset/i))
  // error message disappears
  await waitForElementToBeRemoved(getErrorElement)
  // component successfully re-rendered without errors
  expect(screen.getByText(successRenderMsg)).toBeInTheDocument()

  // check console logging
  expect(consoleError).toHaveBeenCalledTimes(2)
  expect(consoleError.mock.calls[0][0]).toMatch(new RegExp(errorMsg, 'i'))
  expect(consoleError.mock.calls[1][0]).toMatch(/The above error occurred in the <TestComponent> component/i)
  expect(consoleLog).toHaveBeenCalledTimes(1)
  expect(consoleLog.mock.lastCall[0]).toMatch(/federated module failed/gi)
  expect(consoleDir).toHaveBeenCalledTimes(2)
  expect(consoleDir.mock.calls[0][0].toString()).toBe(`Error: ${errorMsg}`)
  expect(consoleDir.mock.calls[1][0]).toMatch(/at TestComponent/)

  // restore console methods
  consoleError.mockRestore()
  consoleLog.mockRestore()
  consoleDir.mockRestore()
})

test.todo('custom error fallback & reset')