import React from 'react'
import {Grid, Typography, withStyles, createStyles} from '@material-ui/core'
import {defineMessages} from 'react-intl'
import {compose} from 'redux'

import {withI18n} from '@/i18n/helpers'

const I18N_PREFIX = 'notFound'

const messages = defineMessages({
  notFound: {
    id: `${I18N_PREFIX}.notFound`,
    defaultMessage: 'We are sorry, but the requested url could not be found.',
  },
})

const styles = createStyles({
  wrapper: {
    height: '100%',
  },
})

const PageNotFound = ({classes, i18n: {translate}}) => (
  <Grid
    className={classes.wrapper}
    container
    justify="center"
    alignItems="center"
    direction="column"
  >
    <Typography variant="h1">404</Typography>
    <Typography variant="h6">{translate(messages.notFound)}</Typography>
  </Grid>
)

export default compose(
  withI18n,
  withStyles(styles)
)(PageNotFound)
