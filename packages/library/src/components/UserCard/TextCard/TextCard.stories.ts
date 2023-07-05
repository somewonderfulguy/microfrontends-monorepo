import type { Meta, StoryObj } from '@storybook/react'

import TextCard from './TextCard'

import styles from './TextCard.stories.module.css'

const meta = {
  component: TextCard,
  tags: ['autodocs']
} as Meta<typeof TextCard>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  name: 'Default (full width)',
  args: {
    children: `Adam Smasher is a full borg solo and rival of Morgan Blackhand.
He is employed by Arasaka and by 2077, has risen to the position of head of security and the
personal bodyguard of Yorinobu Arasaka. Smasher is a towering cyborg, with little humanity
left to be seen - not that he ever had much. After being reduced to mush by an RPG blast,
Arasaka offered him a choice - either pull the plug or become a full body conversion cyborg.
With little to no options and a lack of care for his human side, he agreed and became more
machine than man.`
  }
}

export const DefaultWithWidth: Story = {
  name: 'Default (with smaller width)',
  args: {
    ...Default.args,
    style: { width: 400 }
  }
}

export const CroppedSideShapes: Story = {
  args: {
    ...DefaultWithWidth.args,
    children: `V, an alias for Valerie/Vincent, is a mercenary involved in a series of
singular events during the year 2077, which toppled the balance of power in Night City.`
  }
}

export const Empty: Story = {
  args: {
    ...DefaultWithWidth.args,
    children: undefined
  }
}

export const AbsolutelyEmpty: Story = {
  name: 'Absolutely Empty (with forced height)',
  args: {
    ...Default.args,
    className: styles.heightImportantSixHundredsPx,
    children: ''
  }
}
