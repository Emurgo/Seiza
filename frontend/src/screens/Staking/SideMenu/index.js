// @flow
import React from 'react'
import {makeStyles} from '@material-ui/styles'

import {Card, MobileOnly, DesktopOnly} from '@/components/visual'
import SettingsBar from './SettingsBar'
import NavigationBar from './NavigationBar'

const useStyles = makeStyles((theme) => ({
  wrapper: {
    height: '100%',
    overflow: 'visible', // Note: sticky navigation is not working without this
    // Note(ppershing): this fixes EM-345
    display: 'flex',
    flexDirection: 'column',
  },
}))

type SideMenuProps = {
  yoroiTopBarPortal: boolean,
  mobileSettingsBarPortal: boolean,
}
const SideMenu = ({yoroiTopBarPortal = true, mobileSettingsBarPortal = true}: SideMenuProps) => {
  const classes = useStyles()

  return (
    <React.Fragment>
      <MobileOnly>
        <SettingsBar
          yoroiTopBarPortal={yoroiTopBarPortal}
          mobileSettingsBarPortal={mobileSettingsBarPortal}
        />
        <NavigationBar />
      </MobileOnly>
      <DesktopOnly className="h-100">
        <Card className={classes.wrapper}>
          <SettingsBar yoroiTopBarPortal={false} mobileSettingsBarPortal={false} />
          <NavigationBar />
        </Card>
      </DesktopOnly>
    </React.Fragment>
  )
}

export default SideMenu
