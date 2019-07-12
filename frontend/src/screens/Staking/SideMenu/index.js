// @flow
import React from 'react'
import {makeStyles} from '@material-ui/styles'

import {Card} from '@/components/visual'
import {useIsMobile} from '@/components/hooks/useBreakpoints'
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
  const isMobile = useIsMobile()

  if (isMobile) {
    return (
      <React.Fragment>
        <SettingsBar />
        <NavigationBar />
      </React.Fragment>
    )
  }

  return (
    <Card className={classes.wrapper}>
      <SettingsBar />
      <NavigationBar />
    </Card>
  )
}

export default SideMenu
