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
 * - Mobile view. If tabs are too wide to fit on screen (or container), they will be horizontally scrollable.
 * - RTL - animations and styles are mirrored.
 *
 * Links:
 * - Reach UI API: https://reach.tech/tabs
 * - Reach UI NPM: https://www.npmjs.com/package/@reach/tabs
 *
 * Q: Why not use Radix or other headless UI library as Reach UI seems to be abandoned?<br/>
 * A: Reach UI has wider API and more features than other libraries.
 * Most of libraries do not expose internal data via context - Reach UI does it through `useTabsContext`.
 * None of the libraries, except Reach UI, has `<TabPanels />` wrapper component that allows to perform animated height change.
 * */
const meta: Meta<typeof Tabs> = {
  component: Tabs,
  tags: ['autodocs']
}

export default meta

type Story = StoryObj<typeof meta>

const childrenSampleOne = (
  <>
    <TabList>
      <Tab>Videos</Tab>
      <Tab>Wallpapers long tab name</Tab>
      <Tab>Screenshots</Tab>
      <Tab>V</Tab>
      <Tab>Concept arts</Tab>
    </TabList>
    <TabPanels style={{ marginTop: 30 }}>
      <TabPanel>Videos tab content.</TabPanel>
      <TabPanel>
        Wallpapers tab content. Wallpapers tab content. Wallpapers tab content.
        Wallpapers tab content. Wallpapers tab content.
        <br />
        Wallpapers tab content. Wallpapers tab content. Wallpapers tab content.
        Wallpapers tab content. Wallpapers tab content.
        <br />
        Wallpapers tab content. Wallpapers tab content. Wallpapers tab content.
        Wallpapers tab content. Wallpapers tab content.
        <br />
        Wallpapers tab content. Wallpapers tab content. Wallpapers tab content.
        Wallpapers tab content. Wallpapers tab content.
        <br />
        Wallpapers tab content. Wallpapers tab content. Wallpapers tab content.
        Wallpapers tab content. Wallpapers tab content.
      </TabPanel>
      <TabPanel>Screenshots tab content</TabPanel>
      <TabPanel>V is the main character.</TabPanel>
      <TabPanel>Concept arts tab content</TabPanel>
    </TabPanels>
  </>
)

const childrenSampleTwo = (
  <>
    <TabList>
      <Tab>Cyberpunk 2077</Tab>
      <Tab>Phantom Liberty - new DLC</Tab>
      <Tab>Edgerunners</Tab>
      <Tab>V</Tab>
      <Tab>Music</Tab>
    </TabList>
    <TabPanels style={{ marginTop: 30 }}>
      <TabPanel>Cyberpunk 2077 tab content</TabPanel>
      <TabPanel>
        Phantom liberty tab content <br /> Phantom liberty tab content
      </TabPanel>
      <TabPanel>
        Edgerunners tab content <br /> Edgerunners tab content <br />
        Edgerunners tab content
      </TabPanel>
      <TabPanel>
        V is the main character. <br /> V is the main character. <br />V is the
        main character. <br /> V is the main character. <br /> V is the main
        character. <br /> V is the main character.
      </TabPanel>
      <TabPanel>
        Music tab content <br /> Music tab content
        <br /> Music tab content <br /> Music tab content
        <br /> Music tab content <br /> Music tab content
        <br /> Music tab content <br /> Music tab content
        <br /> Music tab content <br /> Music tab content
      </TabPanel>
    </TabPanels>
  </>
)

/** By default `type` is `underline` */
export const UnderlineTabs: Story = {
  args: {
    type: 'underline',
    defaultIndex: 0,
    children: childrenSampleOne
    // leaving it like this, after adding complex conditional types, TS error appeared that I don't know how to fix
  } as never
}

export const UnderlineTabsHoverAnimation: Story = {
  args: {
    type: 'underline',
    animateOnHover: true,
    defaultIndex: 0,
    children: childrenSampleOne
  } as never
}

export const HexagonTabs: Story = {
  args: {
    type: 'hexagon',
    children: childrenSampleTwo
  } as never
}

export const HexagonTabsHoverAnimation: Story = {
  args: {
    type: 'hexagon',
    animateOnHover: true,
    children: childrenSampleTwo
  } as never
}

export const FolderTabs: Story = {
  args: {
    type: 'folder',
    defaultIndex: 1,
    children: (
      <>
        <TabList>
          <Tab>Data</Tab>
          <Tab>Hacking</Tab>
          <Tab>Extra</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>Data tab content.</TabPanel>
          <TabPanel>Hacking tab content.</TabPanel>
          <TabPanel>Extra tab content.</TabPanel>
        </TabPanels>
      </>
    )
  } as never
}

export const ShapedTabs: Story = {
  args: {
    type: 'shaped',
    children: childrenSampleOne
  } as never
}

export const VerticalTabs: Story = {
  args: {
    type: 'vertical',
    children: (
      <>
        <TabList>
          <Tab>Objective</Tab>
          <Tab>Target location</Tab>
          <Tab>Abilities and gear</Tab>
        </TabList>
        <TabPanels style={{ marginLeft: 30, maxWidth: 600 }}>
          <TabPanel>
            Enter the shadowy world of spycraft and become a government secret
            agent — infiltrate high-security buildings, take out enemies, and go
            toe-to-toe against seasoned professionals. Espionage is a high-risk
            game, and failure isn&#8217;t an option. Choose your allies with
            care as you unravel the secrets at the heart of this expansion.
          </TabPanel>
          <TabPanel>
            Watch your back in Dogtown, a dilapidated urban labyrinth nestled
            within the sprawling metropolis of Night City, now under the iron
            grip of a trigger-happy militia. This city-within-a-city, with its
            decaying facades and anarchic streets, presents a stark contrast to
            the neon-drenched skyline of Night City. Every corner and shadowed
            alleyway of Dogtown teems with danger and decay, yet for the brave
            or the desperate, it is a treasure trove of secrets waiting to be
            unearthed. Its crumbling structures and deserted avenues hold untold
            stories and opportunities that beckon to those daring enough to
            navigate its perils. Within its walls, adrenaline-fueled gigs and
            high-stakes quests await, offering rewards that could tip the
            balance in the power-hungry world of Cyberpunk 2077. Engage in
            heart-stopping encounters and navigate treacherous alliances, all
            while trying to carve out a slice of power in the chaos that is
            Dogtown.
          </TabPanel>
          <TabPanel>
            Power up with a new skill tree and craft a unique playstyle — use
            every new weapon and piece of cyberware at your disposal to survive
            in a fractured world of desperate hustlers, cunning netrunners, and
            ruthless mercenaries bent on profit and power.
          </TabPanel>
        </TabPanels>
      </>
    )
  } as never
}

/** Everything's dynamic with drag & droppable tabs (for reordering). */
export const KitchenSink: Story = {
  args: {
    type: 'underline',
    children: childrenSampleOne
  } as never
}
