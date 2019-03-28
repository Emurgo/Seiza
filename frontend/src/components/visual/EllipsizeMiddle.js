import React from 'react'
import {makeStyles} from '@material-ui/styles'

const useStyles = makeStyles((theme) => ({
  wrapper: {
    width: '100%',
    overflow: 'hidden',
    // magic css needed in order for user to make a text selection of all child elements at once
    userSelect: 'all',
    display: 'flex',
  },
  ellipsizedSpan: {
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    width: '100%',
  },
}))

const EllipsizeMiddle = ({value, endCharactersCount = 6}) => {
  const classes = useStyles()
  return typeof value === 'string' && value.length > endCharactersCount ? (
    <div className={classes.wrapper}>
      <span className={classes.ellipsizedSpan}>
        {value.substring(0, value.length - endCharactersCount)}
      </span>
      <span>{value.substring(value.length - endCharactersCount)}</span>
    </div>
  ) : (
    value
  )
}

export default EllipsizeMiddle