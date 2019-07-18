// @flow
import React from 'react'
import cn from 'classnames'
import ReactMarkdown from 'react-markdown'
import {makeStyles} from '@material-ui/styles'
import {Typography} from '@material-ui/core'

import {Tooltip} from '@/components/visual'

type Props = {
  children: React$Node,
  text: string,
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

// Note: '\n\n' seems work also for Edge on Windows
const replaceBreak = (content: string): string => content.replace(/<br\/>/g, '\n\n')

const renderers = {
  paragraph: ({children}) => <Typography variant="body1">{children}</Typography>,
}

const Markdown = ({source}: {source: string}) => (
  <ReactMarkdown source={replaceBreak(source)} renderers={renderers} />
)

const HelpTooltip = ({children, text, className}: Props) => {
  const classes = useStyles()
  return (
    <Tooltip title={<Markdown source={text} />}>
      <div className={cn(classes.underlined, className)}>{children}</div>
    </Tooltip>
  )
}

export default HelpTooltip
