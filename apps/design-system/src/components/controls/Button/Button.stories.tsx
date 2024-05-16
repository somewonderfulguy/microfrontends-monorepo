import type { Meta, StoryObj } from '@storybook/react'

import Button from './Button'

import ExampleIcon from './assets/exampleIcon.svg?react'
import ExampleIconTwo from './assets/exampleIcon2.svg?react'

const meta: Meta<typeof Button> = {
  component: Button,
  tags: ['autodocs']
}

export default meta

type Story = StoryObj<typeof meta>

/** By default `buttonStyle` is `filled`, `size` is `standard`, bottom left corner is cut, `type` is `button`. */
export const Default: Story = {
  args: {
    children: 'Button'
  } as never
}

/** You can specify what areas should be cut. In this example top right corner is cut as well as left side cut horizontally. */
export const DifferentShapeOne: Story = {
  args: {
    children: 'Shape example 1',
    cutTopRightCorner: true,
    cutLeft: true
  } as never
}

/** You can specify what areas should be cut. Here, two corners cut. */
export const DifferentShapeTwo: Story = {
  args: {
    children: 'Shape example 2',
    cutTopLeftCorner: true,
    cutBottomRightCorner: true
  } as never
}

/** Smaller size. */
export const SmallSize: Story = {
  args: {
    children: 'Small',
    buttonSize: 'small',
    cutLeft: true
  } as never
}

/** Button as SVG icon - transparent background; cuts (corners or sides) are not available. Applies filter drop-shadow for SVG on hover/focus. */
export const SVGIcon: Story = {
  args: {
    children: <ExampleIcon />,
    buttonStyle: 'svg'
  } as never
}

/** Active state for SVG Button. */
export const SVGIconActive: Story = {
  args: {
    children: <ExampleIconTwo />,
    buttonStyle: 'svg',
    active: true,
    'aria-label': 'Repeat One'
  } as never
}
