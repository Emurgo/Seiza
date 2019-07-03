// @flow

import React from 'react'
import cn from 'classnames'
import {Typography} from '@material-ui/core'
import {makeStyles} from '@material-ui/styles'
import {defineMessages} from 'react-intl'

import {useI18n} from '@/i18n/helpers'
import {LoadingInProgress} from '@/components/visual'
import {LoadingError} from '@/components/common'

const messages = defineMessages({
  noData: 'There are no pools selected.',
})

const useStyles = makeStyles((theme) => ({
  loading: {
    marginTop: '100px',
  },
  error: {
    marginTop: theme.spacing(2),
    marginLeft: theme.spacing(2),
  },
}))

type WithEnsureDataLoadedProps = {|
  children: ({data: any, loading: boolean}) => React$Node,
  error: any,
  loading: boolean,
  data: any,
  loadingClassName?: string,
  errorClassName?: string,
|}

// TODO: condider using also for components outside Staking
export const WithEnsureDataLoaded = ({
  children,
  error,
  loading,
  data,
  loadingClassName,
  errorClassName,
}: WithEnsureDataLoadedProps) => {
  const classes = useStyles()

  if (loading && !data) {
    // Note: this can hardly be cented right using FullWidth layout
    return (
      <div className={cn(classes.loading, loadingClassName)}>
        <LoadingInProgress />
      </div>
    )
  }

  if (error) {
    return (
      <div className={cn(classes.error, errorClassName)}>
        <LoadingError error={error} />
      </div>
    )
  }

  return children({data, loading})
}

const useEnsureStakePoolsLoadedStyles = makeStyles((theme) => ({
  noPools: {
    padding: theme.spacing(2),
  },
}))

// TODO: consider using for more screens in Staking
export const WithEnsureStakePoolsLoaded = (props: WithEnsureDataLoadedProps) => {
  const {translate: tr} = useI18n()
  const classes = useEnsureStakePoolsLoadedStyles()

  return (
    <WithEnsureDataLoaded {...props}>
      {({data, loading}) => {
        if (!loading && !(data || []).length) {
          return <Typography className={classes.noPools}>{tr(messages.noData)}</Typography>
        }
        return props.children({data, loading})
      }}
    </WithEnsureDataLoaded>
  )
}
