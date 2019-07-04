// @flow
import React from 'react'
import cn from 'classnames'
import {Typography} from '@material-ui/core'
import {makeStyles} from '@material-ui/styles'

import {ContentSpacing} from '@/components/visual'

const useStyles = makeStyles(({palette}) => ({
  wrapper: {
    display: 'flex',
    width: '100%',
  },
  item: {
    flex: 1,
    display: 'flex',
    justifyContent: 'space-between',
  },
  leftItem: {
    borderRight: `0.5px solid ${palette.contentUnfocus}}`,
  },
  rightItem: {
    borderLeft: `0.5px solid ${palette.contentUnfocus}}`,
  },
}))

type Props = {
  label1: React$Node,
  value1: React$Node,
  label2: React$Node,
  value2: React$Node,
}

const TwoColumnRow = ({label1, value1, label2, value2}: Props) => {
  const classes = useStyles()
  return (
    <div className={classes.wrapper}>
      <ContentSpacing className={cn(classes.item, classes.leftItem)}>
        <Typography variant="body1" color="textSecondary">
          {label1}
        </Typography>
        <span>{value1}</span>
      </ContentSpacing>
      <ContentSpacing className={cn(classes.item, classes.rightItem)}>
        <Typography variant="body1" color="textSecondary">
          {label2}
        </Typography>
        <span>{value2}</span>
      </ContentSpacing>
    </div>
  )
}

export default TwoColumnRow
