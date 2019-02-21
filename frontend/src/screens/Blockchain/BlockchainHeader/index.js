// @flow
import React from 'react'
import classnames from 'classnames'
import {Typography, createStyles, withStyles} from '@material-ui/core'
import {defineMessages} from 'react-intl'
import {compose} from 'redux'

import OverviewMetrics from './OverviewMetrics'
import Search from './Search'
import {withI18n} from '@/i18n/helpers'

const messages = defineMessages({
  header: {
    id: 'blockchain.header',
    defaultMessage: 'Ada Blockchain Explorer',
  },
})

const styles = (theme) =>
  createStyles({
    wrapper: {
      display: 'flex',
      justifyContent: 'space-evenly',
      alignItems: 'center',
      flexDirection: 'column',
      height: '300px',
    },
  })

const BlockchainHeader = ({classes, i18n: {translate}}) => (
  <div className={classnames('gradient-bg', classes.wrapper)}>
    <OverviewMetrics />
    <Typography variant="h4">{translate(messages.header)}</Typography>
    <Search />
  </div>
)

export default compose(
  withI18n,
  withStyles(styles)
)(BlockchainHeader)
