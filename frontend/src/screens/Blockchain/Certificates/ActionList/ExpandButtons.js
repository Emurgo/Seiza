import React from 'react'
import cn from 'classnames'
import {defineMessages} from 'react-intl'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import {makeStyles} from '@material-ui/styles'
import {Typography, IconButton} from '@material-ui/core'

import {useI18n} from '@/i18n/helpers'
import {Button} from '@/components/visual'

const messages = defineMessages({
  showMore: 'Show more',
  showLess: 'Show less',
})

const useExpandButtonStyles = makeStyles(() => ({
  icon: {
    display: 'inline-block',
    verticalAlign: 'middle',
    transition: 'transform 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
  },
  iconExpanded: {
    transform: 'rotate(180deg)',
  },
  expandButton: {
    textTransform: 'initial',
  },
}))

export const ExpandIconButton = ({onClick, expanded}) => {
  const classes = useExpandButtonStyles()
  return (
    <IconButton color="primary" onClick={onClick} className={classes.expandButton}>
      <ExpandMoreIcon className={cn(classes.icon, expanded && classes.iconExpanded)} />
    </IconButton>
  )
}

export const ShowMoreButton = ({onClick, expanded}) => {
  const {translate: tr} = useI18n()
  const classes = useExpandButtonStyles()
  return (
    <Button onClick={onClick} className={classes.expandButton}>
      <Typography color="primary">
        {expanded ? tr(messages.showLess) : tr(messages.showMore)}
        <ExpandMoreIcon className={cn(classes.icon, expanded && classes.iconExpanded)} />
      </Typography>
    </Button>
  )
}
