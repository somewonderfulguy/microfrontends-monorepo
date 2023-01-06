import React from 'react'

import { render, screen, waitForElementToBeRemoved } from '../../../tests'

import { withLazyHooks } from '..'
import { TestComponentSingleHook as TestComponentSingleHookImpl, TestComponentMultipleHooks as TestComponentMultipleHooksImpl } from './TestComponents'
import { hookOneResult } from './testHooks/useTestHookOne'
import { hookTwoResult } from './testHooks/useTestHookTwo'

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
  screen.debug()
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
  screen.debug()
  await waitForElementToBeRemoved(loader)
  // component appeared
  expect(screen.getByText(hookOneResult)).toBeInTheDocument()
  expect(screen.getByText(hookTwoResult)).toBeInTheDocument()
})

test.todo('error in hook & reset')

test.todo('custom error fallback (for hook) & reset')

test.todo('error in loader (promise) & reset')

test.todo('custom error fallback (for loader) & reset')

test.todo('custom query key with accessing query client')

test.todo('? maximum configuration ? (? happy/unhappy paths ?)')