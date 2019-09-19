// @flow

import React from 'react'
import {Grid, Typography} from '@material-ui/core'
import {makeStyles} from '@material-ui/styles'
import {defineMessages} from 'react-intl'

import {useI18n} from '@/i18n/helpers'
import {reportError} from '@/helpers/errorReporting'

const messages = defineMessages({
  errorTitle: 'Oops! Something went wrong',
  errorMsg: 'Please refresh the page',
})

const useStyles = makeStyles((theme) => ({
  item: {
    marginTop: theme.spacing(3),
  },
}))

type Props = {|
  children: React$Node,
|}

type State = {|
  hasError: boolean,
|}

// Note: not adding refresh functionality via `Button` or other component intentionally as
// this default error handler should use minimum number of components so that they
// can not introduce next error within this handler.
// User can still navigate via navigation in most cases, or refresh manually.
export const DefaultErrorScreen = () => {
  const {translate: tr} = useI18n()
  const classes = useStyles()
  return (
    <Grid container alignItems="center" justify="center" className="h-100">
      <Grid item>
        <Grid container direction="column" alignItems="center">
          <Typography className={classes.item} variant="h1">
            {tr(messages.errorTitle)}
          </Typography>
          <Typography className={classes.item} variant="h2">
            {tr(messages.errorMsg)}
          </Typography>

          <img className={classes.item} alt="" src="/static/assets/error-screen.svg" />
        </Grid>
      </Grid>
    </Grid>
  )
}

// Taken from https://reactjs.org/docs/error-boundaries.html
class DefaultErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {hasError: false}
  }

  static getDerivedStateFromError() {
    return {hasError: true}
  }

  componentDidCatch(error: any, errorInfo: any) {
    reportError(error, {errorInfo})
  }

  render() {
    return this.state.hasError ? <DefaultErrorScreen /> : this.props.children
  }
}

export default DefaultErrorBoundary
