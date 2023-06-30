import type { Meta, StoryObj } from '@storybook/react'

import TextCard from './TextCard'

const meta = {
  component: TextCard,
  tags: ['autodocs']
} as Meta<typeof TextCard>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    style: {
      width: 400
    },
    children: `a a a a a a a a a a a a a a a a a a a a a a a a
a a a a a a a a a a a a a a a a a a a a a a a a
a a a a a a a a a a a a a a a a a a a a a a a a
a a a a a a a a a a a a a a a a a a a a a a a a
a a a a a a a a a a a a a a a a a a a a a a a a
a a a a a a a a a a a a a a a a a a a a a a a a
a a a a a a a a a a a a a a a a a a a a a a a a
a a a a a a a a a a a a a a a a a a a a a a a a
a a a a a a a a a a a a a a a a a a a a a a a a
a a a a a a a a a a a a a a a a a a a a a a a a
a a a a a a a a a a a a a a a a a a a a a a a a
a a a a a a a a a a a a a a a a a a a a a a a a
a a a a a a a a a a a a a a a a a a a a a a a a
a a a a a a a a a a a a a a a a a a a a a a a a`
    //     children: `Johnny Silverhand, born Robert John Linder, was a famous influential
    // rockerboy and the lead singer of the band Samurai before its breakup
    // in 2008. A military veteran who defined the rockerboy movement to
    // what it is today, he was the most prominent figure that fought
    // against the corrupted NUSA government and megacorporations, often
    // being described as a terrorist.`
  },
  parameters: {
    layout: 'padded',
    backgrounds: {
      default: 'cyberpunk',
      values: [{ name: 'cyberpunk', value: '#f5ed00' }]
    }
  }
}

export const CroppedSideShapes: Story = {
  args: {
    ...Default.args,
    children:
      'a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a  a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a'
  },
  parameters: Default.parameters
}

export const Empty: Story = {
  args: {
    ...Default.args,
    children: undefined
  },
  parameters: Default.parameters
}
