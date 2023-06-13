import {
  render,
  screen,
  cleanup,
  Matcher,
  SelectorMatcherOptions
} from '../../../../tests'

import Button from '..'

test('button works as expected', () => {
  const renderButton = (isPreview = false) =>
    render(<Button isPreview={isPreview}>click</Button>)
  const validateButton = () =>
    expect(
      screen.getByText('click', { selector: 'button' })
    ).toBeInTheDocument()
  const svgEyeParams = ['eye.svg', { selector: 'svg' }] as [
    Matcher,
    SelectorMatcherOptions
  ]

  // without isPreview flag (eye icon)
  renderButton()
  validateButton()
  expect(screen.queryByText(...svgEyeParams)).not.toBeInTheDocument()
  cleanup()

  // with isPreview flag (eye icon)
  renderButton(true)
  validateButton()
  expect(screen.getByText(...svgEyeParams)).toBeInTheDocument()
})
