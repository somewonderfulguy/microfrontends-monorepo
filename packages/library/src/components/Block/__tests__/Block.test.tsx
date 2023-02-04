import React from 'react'

import { render, screen, cleanup } from '../../../tests'

import Block, { altText } from '..'

test('block work as expected', () => {
  render(<Block>test</Block>)
  expect(screen.getByText('test')).toBeInTheDocument()
  expect(screen.queryByRole('img')).not.toBeInTheDocument()
  cleanup()

  render(<Block withCybercat />)
  expect(screen.getByAltText(altText)).toBeInTheDocument()
})