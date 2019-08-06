// @flow

import React from 'react'
import {makeStyles} from '@material-ui/styles'
import {defineMessages} from 'react-intl'

import {useI18n} from '@/i18n/helpers'
import {LiteTabs, LiteTab, Card} from '@/components/visual'
import {getPadding as getLiteTabDefaultPadding} from '@/components/visual/LiteTabs'
import useTabState from '@/components/hooks/useTabState'
import PeopleList from './PeopleList'
import Stats from './Stats'

import {useLoadSelectedPoolsData} from './dataLoaders'
import {WithEnsureStakePoolsLoaded} from '../utils'

const messages = defineMessages({
  owners: 'Owners',
  stats: 'Stats',
  noData: 'There are no pools selected.', // TODO: unify no data messages
})

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('md')]: {
      marginLeft: theme.spacing(0),
      marginRight: theme.spacing(0),
    },
  },
}))

const useTabWrapperStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: theme.spacing(3),
    [theme.breakpoints.up('md')]: {
      justifyContent: 'flex-start',
      marginTop: 0,
    },
  },
  fixTabsPadding: {
    paddingLeft: getLiteTabDefaultPadding(theme),
    [theme.breakpoints.up('md')]: {
      paddingLeft: 0,
    },
  },
}))

const TABS = {
  OWNERS: PeopleList,
  STATS: Stats,
}

const TAB_NAMES = Object.keys(TABS)

const People = () => {
  const {translate: tr} = useI18n()
  const classes = useStyles()
  const tabWrapperClasses = useTabWrapperStyles()
  const {error, loading, data} = useLoadSelectedPoolsData()
  const {setTabByEventIndex, currentTabIndex} = useTabState(TAB_NAMES)
  const TabContent = TABS[TAB_NAMES[currentTabIndex]]

  return (
    <WithEnsureStakePoolsLoaded {...{error, loading, data}}>
      {({data}) => (
        <React.Fragment>
          <div className={tabWrapperClasses.root}>
            {/* TODO: When className is applied
                for LiteTabs it's used twice hence why this wrapper */}
            <div className={tabWrapperClasses.fixTabsPadding}>
              <LiteTabs value={currentTabIndex} onChange={setTabByEventIndex}>
                <LiteTab label={tr(messages.owners)} />
                <LiteTab label={tr(messages.stats)} />
              </LiteTabs>
            </div>
          </div>
          <Card classes={classes}>
            <TabContent data={data} />
          </Card>
        </React.Fragment>
      )}
    </WithEnsureStakePoolsLoaded>
  )
}

export default People
