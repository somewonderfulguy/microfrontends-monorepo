import { renderHook } from '@testing-library/react-hooks'

import usePrevious from '..'

test('should return previous value if value updates (null is inital value)', () => {
  const { result, rerender } = renderHook(
    ({ initialValue }) => usePrevious(initialValue),
    { initialProps: { initialValue: 'Initial' } }
  )

  expect(result.current).toBeNull()

  rerender({ initialValue: 'non-initial' })
  expect(result.current).toBe('Initial')

  rerender({ initialValue: 'Absolutely New!' })
  expect(result.current).toBe('non-initial')
})