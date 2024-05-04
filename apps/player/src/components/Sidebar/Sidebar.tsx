import { CSSProperties, useState } from 'react'

import {
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel
} from '@repo/design-system/Tabs'
import useResizeObserver from '@repo/shared/hooks/useResizeObserver'

import styles from './Sidebar.module.css'

const Sidebar = () => {
  const [tabListHeight, setTabListHeight] = useState(0)
  const tabListRef = useResizeObserver((bounds) =>
    setTabListHeight(bounds.height)
  )

  return (
    <div className={styles.sidebar}>
      <Tabs type="folder" className={styles.tabs}>
        <TabList className={styles.tabList} ref={tabListRef}>
          <Tab>Playlist</Tab>
          <Tab>Lyrics</Tab>
        </TabList>
        <TabPanels
          className={styles.tabPanels}
          disableHeightAnimation
          style={
            { '--_tab-list-height': tabListHeight + 'px' } as CSSProperties
          }
        >
          <TabPanel className={styles.tabPanel}>
            <div>Playlist content</div>
          </TabPanel>
          <TabPanel className={styles.tabPanel}>
            <div>Lyrics content</div>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  )
}

export default Sidebar
