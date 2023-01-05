import React from 'react'

import { render, screen, waitForElementToBeRemoved } from '../../../tests'

import { withLazyHooks } from '..'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { TestComponentSingleHook as TestComponentSingleHookImpl, TestComponentMultipleHooks as TestComponentMultipleHooksImpl } from './TestComponents'
import { hookOneResult } from './testHooks/useTestHookOne/useTestHookOne'

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

test.todo('custom loader')

test.todo('multiple hooks')

test.todo('error in hook & reset')

test.todo('custom error fallback (for hook) & reset')

test.todo('error in loader (promise) & reset')

test.todo('custom error fallback (for loader) & reset')

test.todo('custom query key with accessing query client')

test.todo('? maximum configuration ? (? happy/unhappy paths ?)')