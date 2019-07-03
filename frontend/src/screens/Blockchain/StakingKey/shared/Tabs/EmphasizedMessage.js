// @flow
import React from 'react'
import {makeStyles} from '@material-ui/styles'

import {ContentSpacing} from '@/components/visual'
import emphasisIcon from '@/static/assets/icons/emphasis.svg'

const useStyles = makeStyles(({palette, spacing}) => ({
  wrapper: {
    backgroundColor: palette.emphasis.background,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
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
    <ContentSpacing top={0.75} bottom={0.75} className={classes.wrapper}>
      <img alt="" src={emphasisIcon} className={classes.image} />
      {children}
    </ContentSpacing>
  )
}

export default EmphasizedMessage
