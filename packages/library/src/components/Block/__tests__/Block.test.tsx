import { MutableRefObject, useRef } from 'react'

import { render, screen, cleanup, renderHook } from '../../../tests'

import Block, { altText, ForwardedRefType } from '..'

test('block work as expected', () => {
  // simple render
  render(<Block>test</Block>)
  expect(screen.getByText('test')).toBeInTheDocument()
  expect(screen.queryByRole('img')).not.toBeInTheDocument()
  cleanup()

  // render with image and ref
  const ref = renderHook(() => useRef<ForwardedRefType>()).result
    .current as MutableRefObject<ForwardedRefType>
  render(<Block ref={ref} withCybercat />)

  // check image
  expect(screen.getByAltText(altText)).toBeInTheDocument()

  // check ref
  const windowAlert = jest.spyOn(window, 'alert').mockImplementation()
  ref.current?.log()
  expect(windowAlert).toHaveBeenCalledWith('Well done. Now, stop doing it!')
  windowAlert.mockRestore()
})
