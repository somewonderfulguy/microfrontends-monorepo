import { useState } from 'react'

import type { Meta, StoryObj } from '@storybook/react'

import Tabs, { TabList, Tab, TabPanels, TabPanel } from './Tabs'

/** Tabs components. Based on headless Reach UI tabs (see links below). Accessible and fully customizable.
 *
 * You can expect the same API as Reach UI tabs. With few additions: `<Tabs />` component has new `type` prop which allows to change tabs style.
 * You can also use default import and get all sub components using dot notation, e.g. `<Tabs.TabList />`, `<Tabs.Tab />`, etc.
 *
 * Please note that argument table does not contain all props. For full list of props please check Reach UI API.
 *
 * Supported features:
 * - Mobile view. If tabs are too wide to fit on screen, they will be scrollable.
 * - RTL - animations and styles are mirrored.
 *
 * Links:
 * - Reach UI API: https://reach.tech/tabs
 * - Reach UI NPM: https://www.npmjs.com/package/@reach/tabs
 * */
const meta: Meta<typeof Tabs> = {
  component: Tabs,
  tags: ['autodocs']
}

export default meta

type Story = StoryObj<typeof meta>

const VideosTabContent = () => {
  const [count, setCount] = useState(1)
  const arrayFromCount = Array.from({ length: count })

  return (
    <>
      <p>
        <i>
          The buttons will be restyled as soon as <code>Button</code> component
          implemented.
        </i>
      </p>
      <button onClick={() => setCount((c) => c + 1)}>Add line</button>
      <button onClick={() => setCount((c) => c - 1)} disabled={count === 1}>
        Remove line
      </button>
      <br />
      <br />
      {arrayFromCount.map((_, i) => (
        <div key={i}>Videos tab content</div>
      ))}
    </>
  )
}

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
          <TabPanel>
            <VideosTabContent />
          </TabPanel>
          <TabPanel>
            Wallpapers tab content. Wallpapers tab content. Wallpapers tab
            content. Wallpapers tab content. Wallpapers tab content.
            <br />
            Wallpapers tab content. Wallpapers tab content. Wallpapers tab
            content. Wallpapers tab content. Wallpapers tab content.
            <br />
            Wallpapers tab content. Wallpapers tab content. Wallpapers tab
            content. Wallpapers tab content. Wallpapers tab content.
            <br />
            Wallpapers tab content. Wallpapers tab content. Wallpapers tab
            content. Wallpapers tab content. Wallpapers tab content.
            <br />
            Wallpapers tab content. Wallpapers tab content. Wallpapers tab
            content. Wallpapers tab content. Wallpapers tab content.
          </TabPanel>
          <TabPanel>Screenshots tab content</TabPanel>
          <TabPanel>Concept arts tab content</TabPanel>
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
