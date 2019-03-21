import React from 'react'
import {Grid, ButtonBase} from '@material-ui/core'
import {defineMessages} from 'react-intl'
import WithTabState from '@/components/headless/tabState'
import {NavTypography} from '@/components/visual/Navbar'
import {useI18n} from '@/i18n/helpers'
const TAB_NAMES = {
  ALL: 'ALL',
  SENT: 'SENT',
  RECEIVED: 'RECEIVED',
}
const TABS = {
  ORDER: [TAB_NAMES.ALL, TAB_NAMES.SENT, TAB_NAMES.RECEIVED],
  CONTENT: {
    [TAB_NAMES.ALL]: () => null,
    [TAB_NAMES.SENT]: () => null,
    [TAB_NAMES.RECEIVED]: () => null,
  },
}

const messages = defineMessages({
  all: 'All',
  sent: 'Sent',
  received: 'Received',
})

const AddressTabs = () => {
  const {translate: tr} = useI18n()
  return (
    <WithTabState tabNames={TABS.ORDER}>
      {({setTab, currentTab, currentTabName}) => {
        const TabContent = TABS.CONTENT[currentTabName]
        return (
          <React.Fragment>
            <Grid container direction="row" justify="space-between">
              <Grid item>
                <ButtonBase onClick={(event) => setTab(event, TABS.ORDER.indexOf(TAB_NAMES.ALL))}>
                  <NavTypography isActive={currentTabName === TAB_NAMES.ALL}>
                    {tr(messages.all)}
                  </NavTypography>
                </ButtonBase>
              </Grid>
              <Grid item>
                <ButtonBase onClick={(event) => setTab(event, TABS.ORDER.indexOf(TAB_NAMES.SENT))}>
                  <NavTypography isActive={currentTabName === TAB_NAMES.SENT}>
                    {tr(messages.sent)}
                  </NavTypography>
                </ButtonBase>
              </Grid>
              <Grid item>
                <ButtonBase
                  onClick={(event) => setTab(event, TABS.ORDER.indexOf(TAB_NAMES.RECEIVED))}
                >
                  <NavTypography isActive={currentTabName === TAB_NAMES.RECEIVED}>
                    {tr(messages.received)}
                  </NavTypography>
                </ButtonBase>
              </Grid>
            </Grid>

            <TabContent />
          </React.Fragment>
        )
      }}
    </WithTabState>
  )
}

export default AddressTabs
