import React from 'react'
import {makeStyles} from '@material-ui/styles'

const useStyles = makeStyles(({spacing, palette}) => ({
  separatorLine: {
    borderBottom: `1px solid ${palette.contentUnfocus}`,
    flexGrow: 1,
    margin: spacing(1.5),
  },
}))

const SeparatorWithLabel = ({children}) => {
  const classes = useStyles()
  return (
    <React.Fragment>
      <div className={classes.separatorLine} />
      {children}
      <div className={classes.separatorLine} />
    </React.Fragment>
  )
}

export default SeparatorWithLabel
