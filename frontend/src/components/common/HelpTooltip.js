// @flow
import React from 'react'
import cn from 'classnames'
import {Tooltip} from '@/components/visual'
import {makeStyles} from '@material-ui/styles'

type Props = {
  children: React$Node,
  text: React$Node,
  className?: string,
}

const useStyles = makeStyles(() => ({
  underlined: {
    cursor: 'help',
    textDecoration: 'underline',
    textDecorationColor: '#CFD3DE',
    textDecorationStyle: 'dotted',
    textUnderlinePosition: 'under',
  },
}))

const HelpTooltip = ({children, text, className}: Props) => {
  const classes = useStyles()
  return (
    <Tooltip title={text}>
      <div className={cn(classes.underlined, className)}>{children}</div>
    </Tooltip>
  )
}

export default HelpTooltip
