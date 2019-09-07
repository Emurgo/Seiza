import React from 'react'
import assert from 'assert'
import {makeStyles} from '@material-ui/styles'

const useStyles = makeStyles((theme) => ({
  wrapper: {
    width: '100%',
    overflow: 'hidden',
    // Used to disallow text selection. This component should be used together
    // with `CopyToClipboard` component to allow copying of the content.
    // The reason is that having content in two <span> leads to unwanted space character when
    // copying directly.
    userSelect: ({isFixed}) => (isFixed ? 'auto' : 'none'),
    display: ({isFixed}) => (isFixed ? 'inline' : 'flex'),
  },
  ellipsizedSpan: {
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    width: '100%',
  },
}))

const validateParams = ({startCharsCnt, endCharsCnt}) => {
  assert(typeof startCharsCnt === 'number')
  assert(typeof endCharsCnt === 'number')
  assert(startCharsCnt > 0)
  assert(endCharsCnt > 0)
}

const EllipsizeMiddle = ({value, startCharsCnt = null, endCharsCnt = 15}) => {
  const isFixed = startCharsCnt !== null
  const classes = useStyles({isFixed})

  isFixed && validateParams({value, startCharsCnt, endCharsCnt})
  if (isFixed && (value.length < 3 || startCharsCnt + endCharsCnt >= value.length)) {
    return value
  }

  return typeof value === 'string' && value.length > endCharsCnt ? (
    <span className={classes.wrapper}>
      {isFixed ? (
        <React.Fragment>
          {`${value.substring(0, startCharsCnt)}...${value.substring(value.length - endCharsCnt)}`}
        </React.Fragment>
      ) : (
        <React.Fragment>
          <span className={classes.ellipsizedSpan}>
            {value.substring(0, value.length - endCharsCnt)}
          </span>
          <span>{value.substring(value.length - endCharsCnt)}</span>
        </React.Fragment>
      )}
    </span>
  ) : (
    value
  )
}

export default EllipsizeMiddle
