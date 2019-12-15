// @flow

import React from 'react'
import {Grid} from '@material-ui/core'
import {makeStyles} from '@material-ui/styles'
import {defineMessages} from 'react-intl'

import {useI18n} from '@/i18n/helpers'

import {YoroiNonClickableHeaderCard} from '@/components/common'
import WithNotificationState from '@/components/headless/notificationState'

const messages = defineMessages({
  card1Title: 'Delegate ADA',
  card1Value: 'to get rewards while helping securing the network.',
  card2Title: 'How to participate?',
  card2Value: 'find on our list the most profitable stake pool to delegate. It’s risk-free.',
  card3Title: 'When do I get the rewards?',
  card3Value: 'They are automatically delivered by the protocol at the end of a period (aka Epoch)',
})

const useStyles = makeStyles(({palette, spacing}) => ({
  wrapper: {
    position: 'relative',
    height: '128px',
    background: palette.background.paper,
  },
  cardNarrow: {
    width: 320,
    height: 80,
  },
  cardWide: {
    width: 360,
    height: 80,
  },
  closeWrapper: {
    'position': 'absolute',
    'top': 0,
    'bottom': 0,
    'right': '30px',
    'width': 24,
    'height': 24,
    'margin': 'auto',
    '&:hover': {
      cursor: 'pointer',
    },
  },
}))

const CloseButton = ({onClick, classes, icon}) => {
  return (
    <div onClick={onClick} className={classes}>
      {icon}
    </div>
  )
}

const YoroiHeader = () => {
  const classes = useStyles()
  const {translate: tr} = useI18n()
  return (
    <WithNotificationState>
      {({isOpen, closeNotif}) => {
        return (
          isOpen && (
            <Grid
              container
              className={classes.wrapper}
              direction="row"
              justify="center"
              alignItems="center"
              wrap="nowrap"
            >
              <Grid container direction="row" justify="center" alignItems="center" wrap="nowrap">
                <YoroiNonClickableHeaderCard
                  secondaryText={tr(messages.card1Value)}
                  primaryText={tr(messages.card1Title)}
                  icon={
                    <img alt="" src="/static/assets/icons/staking-simulator/yoroi-rewards.svg" />
                  }
                  className={classes.cardNarrow}
                />
                <YoroiNonClickableHeaderCard
                  secondaryText={tr(messages.card2Value)}
                  primaryText={tr(messages.card2Title)}
                  icon={
                    <img alt="" src="/static/assets/icons/staking-simulator/yoroi-search.svg" />
                  }
                  className={classes.cardNarrow}
                />
                <YoroiNonClickableHeaderCard
                  secondaryText={tr(messages.card3Value)}
                  primaryText={tr(messages.card3Title)}
                  icon={
                    <img alt="" src="/static/assets/icons/staking-simulator/yoroi-delegated.svg" />
                  }
                  className={classes.cardWide}
                />
              </Grid>
              <CloseButton
                classes={classes.closeWrapper}
                onClick={closeNotif}
                icon={
                  <img alt="" src="/static/assets/icons/staking-simulator/yoroi-close-notif.svg" />
                }
              />
            </Grid>
          )
        )
      }}
    </WithNotificationState>
  )
}

export default YoroiHeader
