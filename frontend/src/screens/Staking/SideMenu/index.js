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
  },
}))

const SideMenu = () => {
  const classes = useStyles()

  return (
    <React.Fragment>
      <MobileOnly>
        <SettingsBar />
        <NavigationBar />
      </MobileOnly>
      <DesktopOnly>
        <Card className={classes.wrapper}>
          <SettingsBar />
          <NavigationBar />
        </Card>
      </DesktopOnly>
    </React.Fragment>
  )
}

export default SideMenu
