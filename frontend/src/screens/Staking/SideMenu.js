import React from 'react'
import {compose} from 'redux'
import {createStyles, withStyles} from '@material-ui/core'

const styles = () =>
  createStyles({
    wrapper: {
      height: '600px', // NOTE: temporary
      background: 'grey', // NOTE: temporary
    },
  })

const SideMenu = ({classes}) => <div className={classes.wrapper} />

export default compose(withStyles(styles))(SideMenu)
