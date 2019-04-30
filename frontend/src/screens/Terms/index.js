// @flow
import React from 'react'
import _ from 'lodash'
import ReactMarkdown from 'react-markdown'

import {Typography} from '@material-ui/core'
import {makeStyles} from '@material-ui/styles'
import {SimpleLayout, ExpansionPanel} from '@/components/visual'

import {useI18n} from '@/i18n/helpers'
import messages from './tos.en'

const useStyles = makeStyles((theme) => ({
  container: {
    margin: theme.spacing.unit * 10,
  },
  preamble: {
    padding: theme.spacing.unit * 2,
  },
  heading: {
    marginBottom: '10px',
  },
  panelContent: {
    padding: theme.spacing.unit * 3,
  },
  mdParagraph: {
    textAlign: 'justify',
  },
}))

const MdParagraph = ({children}) => {
  const classes = useStyles()
  return (
    <Typography variant="body1" className={classes.mdParagraph}>
      {children}
    </Typography>
  )
}

const renderers = {
  paragraph: MdParagraph,
  /* Customize if required
  strong: ({children}) => <strong>{children}</strong>,
  emphasis: ({children}) => <em>{children}</em>,
  */
}

const Markdown = ({children}) => <ReactMarkdown renderers={renderers} source={children} />

type PanelProps = {
  head: string,
  content: React$Node,
}

const Panel = ({head, content}: PanelProps) => {
  const classes = useStyles()
  return (
    <ExpansionPanel summary={<Typography variant="title">{head}</Typography>}>
      <div className={classes.panelContent}>
        <Markdown>{content}</Markdown>
      </div>
    </ExpansionPanel>
  )
}

const Preamble = ({head, content}) => {
  const classes = useStyles()
  return (
    <div className={classes.preamble}>
      <Typography variant="h2" className={classes.heading}>
        {head}
      </Typography>
      <Markdown>{content}</Markdown>
    </div>
  )
}

const Terms = () => {
  const {translate: tr} = useI18n()
  return (
    <SimpleLayout maxWidth="800px">
      <Preamble head={tr(messages.heading)} content={tr(messages.preamble)} />
      {_.range(11).map((i) => (
        <Panel
          key={i}
          head={`${i + 1}. ${tr(messages[`h${i + 1}`])}`}
          content={tr(messages[`p${i + 1}`])}
        />
      ))}
    </SimpleLayout>
  )
}

export default Terms
