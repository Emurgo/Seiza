import React from 'react'
import {compose} from 'redux'
import {createStyles, withStyles} from '@material-ui/core'

const styles = () =>
  createStyles({
    wrapper: {
      height: '2000px', // Note: temporary
      background: '#ccc', // Note: temporary
    },
  })

const StakeList = ({classes}) => <div className={classes.wrapper} />

export default compose(withStyles(styles))(StakeList)
