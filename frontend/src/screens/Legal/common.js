// @flow
import React, {useRef} from 'react'
import ReactMarkdown from 'react-markdown'

import {Typography} from '@material-ui/core'
import {makeStyles} from '@material-ui/styles'

import {SimpleLayout, ExpansionPanel, ExternalLink} from '@/components/visual'
import {useScrollFromBottom} from '@/hooks/useScrollFromBottom'

import {routeTo} from '@/helpers/routes'
import {useI18n} from '@/i18n/helpers'

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
    padding: `${theme.spacing.unit}px ${theme.spacing.unit * 4}px`,
  },
  mdParagraph: {
    textAlign: 'justify',
  },
  list: {
    paddingLeft: theme.spacing.unit * 2,
    listStyleType: 'none',
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

const LinkRenderer = (props) => {
  // We treat all links as external
  return (
    <ExternalLink target="_blank" to={props.href}>
      {props.children}
    </ExternalLink>
  )
}

const ListRenderer = (props) => {
  const classes = useStyles()
  return <ul className={classes.list}>{props.children}</ul>
}

const renderers = {
  paragraph: MdParagraph,
  link: LinkRenderer,
  list: ListRenderer,
  /* Customize if required
  strong: ({children}) => <strong>{children}</strong>,
  emphasis: ({children}) => <em>{children}</em>,
  */
}

const replaceBreak = (content: string): string => content.replace(/<br\/>/g, '&nbsp;  ')

const Markdown = ({children}) => <ReactMarkdown renderers={renderers} source={children} />

type PanelProps = {
  head: string,
  content: string,
}

const Panel = ({head, content}: PanelProps) => {
  const classes = useStyles()
  return (
    <ExpansionPanel summary={<Typography variant="title">{replaceBreak(head)}</Typography>}>
      <div className={classes.panelContent}>
        <Markdown>{replaceBreak(content)}</Markdown>
      </div>
    </ExpansionPanel>
  )
}

const Preamble = ({head, content}) => {
  const classes = useStyles()
  return (
    <div className={classes.preamble}>
      <Typography variant="h2" className={classes.heading}>
        {replaceBreak(head)}
      </Typography>
      <Markdown>{replaceBreak(content)}</Markdown>
    </div>
  )
}

const getPanelMessages = (messages, tr, links) => {
  const panelMessages = []

  let i = 1
  const _getHead = (i) => (messages[`h${i}`] != null ? `${i}. ${tr(messages[`h${i}`])}` : '')
  const _getContent = (i) => (messages[`p${i}`] != null ? tr(messages[`p${i}`], links) : '')

  while (_getHead(i) !== '' || _getContent(i) !== '') {
    panelMessages.push({head: _getHead(i), content: _getContent(i)})
    i += 1
  }
  return panelMessages
}

const LegalTermsLayout = ({messages, paragrahpsCount}: {messages: any}) => {
  const {translate: tr} = useI18n()
  const scrollToRef = useRef(null)

  useScrollFromBottom(scrollToRef)

  const links = {
    // We we create "external" links from internal ones

    // eslint-disable-next-line no-restricted-globals
    privacyUrl: `${location.origin}${routeTo.privacy()}`,
    // eslint-disable-next-line no-restricted-globals
    termsUrl: `${location.origin}${routeTo.termsOfUse()}`,
  }

  const panelMessages = getPanelMessages(messages, tr, links)

  return (
    <div ref={scrollToRef}>
      <SimpleLayout maxWidth="800px">
        <Preamble head={tr(messages.heading)} content={tr(messages.preamble, links)} />
        {panelMessages.map(({head, content}, i) => (
          <Panel key={i} head={head} content={content} />
        ))}
      </SimpleLayout>
    </div>
  )
}

export default LegalTermsLayout
