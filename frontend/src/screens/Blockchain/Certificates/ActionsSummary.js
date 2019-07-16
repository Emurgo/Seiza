import React from 'react'
import {makeStyles} from '@material-ui/styles'
import _ from 'lodash'

import ActionIcon from './ActionIcon'
import {useI18n} from '@/i18n/helpers'
import {actionsSummaryMessages} from './actionTypes'

const certActionsToMessages = (actions = [], {translate: tr}) => {
  const certActionCounts = _.countBy(actions, 'type')
  return actions.map((cert) =>
    tr(actionsSummaryMessages[cert.type], {count: certActionCounts[cert.type]})
  )
}

const certActionsToIcons = (actions = []) =>
  actions.map((cert, index) => <ActionIcon key={index} type={cert.type} />)

const useStyles = makeStyles(({spacing}) => ({
  wrapper: {
    marginRight: spacing(3),
  },
  label: {
    paddingLeft: spacing(1),
  },
}))

const ActionsSummary = ({actions = []}) => {
  const i18n = useI18n()
  const classes = useStyles()
  const certificatesMessages = certActionsToMessages(actions, i18n)
  const icons = certActionsToIcons(actions)
  return (
    <div>
      {_.zip(icons, certificatesMessages).map(([icon, certMessage], index) => (
        <span key={index} className={classes.wrapper}>
          {icon}
          <span className={classes.label}>{certMessage}</span>
        </span>
      ))}
    </div>
  )
}

export default ActionsSummary
