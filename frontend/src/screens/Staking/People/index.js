// @flow

import React from 'react'
import {Paper} from '@material-ui/core'
import {People as OwnersIcon, ViewHeadline as StatsIcon} from '@material-ui/icons'
import {makeStyles} from '@material-ui/styles'
import {defineMessages} from 'react-intl'

import {useI18n} from '@/i18n/helpers'
import {Tab, Tabs} from '@/components/visual'
import WithTabState from '@/components/headless/tabState'
import PeopleList from './PeopleList'
import Stats from './Stats'

const messages = defineMessages({
  owners: 'Owners',
  stats: 'Stats',
})

const useStyles = makeStyles((theme) => ({
  wrapper: {
    marginTop: theme.spacing.unit * 3,
    marginBottom: theme.spacing.unit * 3,
  },
}))

// TODO: get from graphql server
const mockedData = [
  {
    poolName: 'Stake pool name',
    poolHash: 'feawfewafewafeaf',
    owners: [
      {
        stakingKey: '3244t343t43t3tfwfewafeawfe',
        pledge: '434354354354354354',
      },
      {
        stakingKey: '2244t343t43t3tfwfewafeawfe',
        pledge: '434354354354354354',
      },
    ],
  },
  {
    poolName: 'Stake pool name 2',
    poolHash: 'feawfewafewafeaffe',
    owners: [
      {
        stakingKey: '2244t343t43t3tffewfewafeawfe',
        pledge: '434354354354354354',
      },
    ],
  },
  {
    poolName: 'Stake pool name 3',
    poolHash: 'feawfewafewafeaeeewff',
    owners: [
      {
        stakingKey: '3244t343tf43t3tfwfewafeawfe',
        pledge: '434354354354354354',
      },
      {
        stakingKey: '2244t34f3t43t3tfwfewafeawfe',
        pledge: '434354354354354354',
      },
      {
        stakingKey: '2244et343t43t3tfwfewafeawfe',
        pledge: '434354354354354354',
      },
    ],
  },
]

const TABS = {
  OWNERS: () => <PeopleList data={mockedData} />,
  STATS: Stats,
}

const TAB_NAMES = Object.keys(TABS)

const People = () => {
  const {translate: tr} = useI18n()
  const classes = useStyles()

  return (
    <WithTabState tabNames={TAB_NAMES}>
      {({setTab, currentTab, currentTabName}) => {
        const TabContent = TABS[currentTabName]
        return (
          <Paper className={classes.wrapper}>
            <Tabs value={currentTab} onChange={setTab}>
              <Tab icon={<OwnersIcon />} label={tr(messages.owners)} />
              <Tab icon={<StatsIcon />} label={tr(messages.stats)} />
            </Tabs>
            <TabContent />
          </Paper>
        )
      }}
    </WithTabState>
  )
}

export default People
