import { render, screen } from '../../../tests'

import TestComponent from './TestComponent'

const assertZeroes = () => {
  expect(screen.getByText('width: 0')).toBeInTheDocument()
  expect(screen.getByText('height: 0')).toBeInTheDocument()
  expect(screen.getByText('left: 0')).toBeInTheDocument()
  expect(screen.getByText('top: 0')).toBeInTheDocument()
}

// eslint-disable-next-line jest/expect-expect
test('useResizeObserver renders successfully', () => {
  render(<TestComponent />)
  assertZeroes()
})

test('useResizeObserver with inital bounds renders successfully', () => {
  render(
    <TestComponent
      initialBounds={{ width: 50, height: 100, left: 150, top: 200 }}
    />
  )
  expect(screen.getByText('width: 50')).toBeInTheDocument()
  expect(screen.getByText('height: 100')).toBeInTheDocument()
  expect(screen.getByText('left: 150')).toBeInTheDocument()
  expect(screen.getByText('top: 200')).toBeInTheDocument()
})

// eslint-disable-next-line jest/expect-expect
test('useResizeObserver with delay param renders successfully', () => {
  render(<TestComponent delay={200} />)
  assertZeroes()
})

// eslint-disable-next-line jest/expect-expect
test('useResizeObserver does not fall if div ref is undefined', () => {
  render(<TestComponent doNotBind />)
  assertZeroes()
})
