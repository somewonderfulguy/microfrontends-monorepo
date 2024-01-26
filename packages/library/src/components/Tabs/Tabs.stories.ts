import type { Meta, StoryObj } from '@storybook/react'

import Tabs from './Tabs'

const meta: Meta<typeof Tabs> = {
  component: Tabs,
  tags: ['autodocs']
}

export default meta

type Story = StoryObj<typeof meta>

/** Accessible tabs. More description comes. */
export const Default: Story = {}
