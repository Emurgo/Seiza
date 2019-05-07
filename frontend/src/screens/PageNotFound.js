import React from 'react'
import {Grid, Typography} from '@material-ui/core'
import {makeStyles} from '@material-ui/styles'
import {defineMessages} from 'react-intl'

import {useI18n} from '@/i18n/helpers'
import errorImage from '@/assets/error-screen.svg'

const messages = defineMessages({
  notFound: 'We are sorry, but the requested url could not be found.',
})

const useStyles = makeStyles((theme) => ({
  wrapper: {
    height: '100%',
    padding: theme.spacing.unit * 6,
  },
  message: {
    marginTop: theme.spacing.unit * 3,
  },
}))

const PageNotFound = () => {
  const classes = useStyles()
  const {translate: tr} = useI18n()
  return (
    <Grid
      className={classes.wrapper}
      container
      justify="center"
      alignItems="center"
      direction="column"
    >
      <img src={errorImage} alt="" />
      <Typography className={classes.message} variant="h6">
        {tr(messages.notFound)}
      </Typography>
    </Grid>
  )
}

export default PageNotFound
