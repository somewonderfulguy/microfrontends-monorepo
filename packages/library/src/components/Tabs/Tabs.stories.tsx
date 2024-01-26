import type { Meta, StoryObj } from '@storybook/react'

import Tabs, { TabList, Tab, TabPanels, TabPanel } from './Tabs'

const meta: Meta<typeof Tabs> = {
  component: Tabs,
  tags: ['autodocs']
}

export default meta

type Story = StoryObj<typeof meta>

/** By default `type` is `underline` */
export const Default: Story = {
  args: {
    children: (
      <>
        <TabList>
          <Tab>Videos</Tab>
          <Tab>Wallpapers</Tab>
          <Tab>Screenshots</Tab>
          <Tab>Concept arts</Tab>
        </TabList>
        <TabPanels style={{ marginTop: 30 }}>
          <TabPanel>Cyberpunk 2077 tab content</TabPanel>
          <TabPanel>Phantom liberty tab content</TabPanel>
          <TabPanel>Edgerunners tab content</TabPanel>
          <TabPanel>Night city wire tab content</TabPanel>
        </TabPanels>
      </>
    )
  }
}

export const Hexagon: Story = {
  args: {
    type: 'hexagon',
    children: (
      <>
        <TabList>
          <Tab>Videos</Tab>
          <Tab>Wallpapers</Tab>
          <Tab>Screenshots</Tab>
          <Tab>Concept arts</Tab>
        </TabList>
        <TabPanels style={{ marginTop: 30 }}>
          <TabPanel>Cyberpunk 2077 tab content</TabPanel>
          <TabPanel>Phantom liberty tab content</TabPanel>
          <TabPanel>Edgerunners tab content</TabPanel>
          <TabPanel>Night city wire tab content</TabPanel>
        </TabPanels>
      </>
    )
  }
}
