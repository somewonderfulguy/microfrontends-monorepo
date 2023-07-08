import type { Meta, StoryObj } from '@storybook/react'

import useAvatar from './useAvatar'

import avatar from './assets/silverhand300.jpg'

const ExampleComponent = () => {
  const { getAvatarProps } = useAvatar<HTMLDivElement>()
  return (
    <div {...getAvatarProps()}>
      <img src={avatar} alt="avatar" />
    </div>
  )
}

const meta = {
  title: 'hooks/useAvatar',
  component: ExampleComponent,
  tags: ['autodocs']
} as Meta<typeof ExampleComponent>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  parameters: {
    backgrounds: {
      default: 'cyberpunk',
      values: [{ name: 'cyberpunk', value: '#f5ed00' }]
    }
  }
}
