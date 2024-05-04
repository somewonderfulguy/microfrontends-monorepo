import { forwardRef, HTMLAttributes, useRef } from 'react'
import { TabPanel as ReachTabPanel, TabPanelProps } from '@reach/tabs'

import { useFadeInOutAnimation } from './hooks'

const TabPanel = forwardRef<
  HTMLDivElement,
  TabPanelProps & HTMLAttributes<HTMLDivElement>
>(({ children, ...props }, ref) => {
  const divElem = useRef<HTMLDivElement>(null)

  useFadeInOutAnimation(divElem)

  return (
    <ReachTabPanel {...props} ref={ref}>
      <div ref={divElem}>{children}</div>
    </ReachTabPanel>
  )
})
TabPanel.displayName = 'TabPanelWrapper'

export default TabPanel
