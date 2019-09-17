// @flow
import React from 'react'
import {makeStyles} from '@material-ui/styles'

const useStyles = makeStyles(({palette, spacing, getContentSpacing, breakpoints}) => ({
  wrapper: {
    backgroundColor: palette.emphasis.background,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: spacing(1.25),
    paddingBottom: spacing(1.25),
    paddingLeft: getContentSpacing(0.5),
    paddingRight: getContentSpacing(0.5),
    [breakpoints.up('sm')]: {
      paddingTop: spacing(2.5),
      paddingBottom: spacing(2.5),
      paddingLeft: getContentSpacing(),
      paddingRight: getContentSpacing(),
    },
  },
  image: {
    marginRight: spacing(2),
  },
}))

type Props = {
  children: React$Node,
}

const EmphasizedMessage = ({children}: Props) => {
  const classes = useStyles()
  return (
    <div className={classes.wrapper}>
      <img alt="" src="/static/assets/icons/emphasis.svg" className={classes.image} />
      {children}
    </div>
  )
}

export default EmphasizedMessage
