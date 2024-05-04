import type { Meta, StoryObj } from '@storybook/react'

import useAvatar from './useAvatar'

import styles from './useAvatar.stories.module.css'
import avatar from './assets/silverhand300.jpg'
import avatarRed from './assets/silverhand300_red.jpg'
import avatarGreen from './assets/silverhand300_green.jpg'

const ExampleComponent = () => {
  const { getAvatarProps } = useAvatar<HTMLDivElement>()
  return (
    <div {...getAvatarProps()}>
      <img src={avatar} className={styles.avatarYellow} alt="avatar" />
      <img src={avatarRed} className={styles.avatarRed} alt="avatar" />
      <img src={avatarGreen} className={styles.avatarGreen} alt="avatar" />
    </div>
  )
}

const meta: Meta<typeof ExampleComponent> = {
  title: 'hooks/useAvatar',
  component: ExampleComponent,
  tags: ['autodocs']
}

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
