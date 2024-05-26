import type { Meta, StoryObj } from '@storybook/react'

import TimeCount from './TimeCount'

const meta: Meta<typeof TimeCount> = {
  component: TimeCount,
  tags: ['autodocs']
}

export default meta

type Story = StoryObj<typeof meta>

/** Playback time displayed in format `[current time] / [duration]`. The time format is `[h:]m:ss`. */
export const Default: Story = {}
