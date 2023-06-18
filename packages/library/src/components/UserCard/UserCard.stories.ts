import type { Meta, StoryObj } from '@storybook/react'

import UserCard from './UserCard'

const meta = {
  component: UserCard,
  tags: ['autodocs']
} as Meta<typeof UserCard>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
