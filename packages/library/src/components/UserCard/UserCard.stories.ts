import type { Meta, StoryObj } from '@storybook/react'

import UserCard from './UserCard'

const meta: Meta<typeof UserCard> = {
  component: UserCard,
  tags: ['autodocs']
}

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  parameters: {}
}
