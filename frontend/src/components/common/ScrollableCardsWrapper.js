// @flow

import React from 'react'
import cn from 'classnames'
import {makeStyles} from '@material-ui/styles'
import {fade} from '@material-ui/core/styles/colorManipulator'

import {useScrollableWrapperStyles} from '@/components/common/HeaderCard'

const useStyles = makeStyles((theme) => ({
  mainWrapper: {
    'width': '100%',
    'margin': '0 auto',

    '&::-webkit-scrollbar': {
      height: '2px',
    },
    '&::-webkit-scrollbar-track': {
      background: fade(theme.palette.text.secondary, 0.2),
      borderRadius: 5,
      marginLeft: 10,
      marginRight: 10,
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: fade(theme.palette.text.secondary, 0.7),
      outline: '1px solid slategrey',
      borderRadius: 5,
    },
    'paddingBottom': '10px', // padding between slider

    // for now hide scrollbar for mozilla, as webkit styles do not apply to it
    'scrollbar-width': 'none',

    // Note: we can not disable slider in safari-mobile
    // https://stackoverflow.com/questions/47346527/hiding-scrollbars-via-css-doesnt-work-in-safari-how-to-fix-it
  },
  childrenWrapper: {
    margin: '0 auto',
    width: 'min-content',
  },
}))

type Props = {|
  children: React$Node,
|}

export default ({children}: Props) => {
  const classes = useStyles()
  const overflowClasses = useScrollableWrapperStyles()
  return (
    <div className={cn(classes.mainWrapper, overflowClasses.wrapperOverflow)}>
      <div className={classes.childrenWrapper}>{children}</div>
    </div>
  )
}
