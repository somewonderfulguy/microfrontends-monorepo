import type { Meta, StoryObj } from '@storybook/react'

import Button from './Button'

const meta = {
  component: Button,
  tags: ['autodocs']
} as Meta<typeof Button>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    isPreview: false,
    children: 'Click on me!'
  }
}
