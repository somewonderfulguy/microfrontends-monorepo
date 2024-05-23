import type { Meta, StoryObj } from '@storybook/react'

import FullscreenButton from './FullscreenButton'

const meta: Meta<typeof FullscreenButton> = {
  component: FullscreenButton,
  tags: ['autodocs']
}

export default meta

type Story = StoryObj<typeof meta>

/** Fullscreen button. Has two states: expand and shrink. */
export const Default: Story = {}
