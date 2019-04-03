import React from 'react'
import {makeStyles} from '@material-ui/styles'

const useStyles = makeStyles((theme) => ({
  wrapper: {
    width: '100%',
    overflow: 'hidden',
    // Used to disallow text selection. This component should be used together
    // with `CopyToClipboard` component to allow copying of the content.
    // The reason is that having content in two <span> leads to unwanted space character when
    // copying directly.
    userSelect: 'none',
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
