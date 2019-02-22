// @flow
import React from 'react'
import {Grid, createStyles, withStyles} from '@material-ui/core'
import {defineMessages} from 'react-intl'
import {compose} from 'redux'

import {KeyValueCard, SimpleLayout} from '@/components/visual'
import {withI18n} from '@/i18n/helpers'

const I18N_PREFIX = 'home.generalInfo'

const messages = defineMessages({
  header: {
    id: `${I18N_PREFIX}.header`,
    defaultMessage: 'General info',
  },
})

const styles = () =>
  createStyles({
    row: {
      paddingTop: '20px',
      paddingBottom: '20px',
    },
  })

const MOCKED_ITEMS = [
  {label: 'Info1', value: 'TODO'},
  {label: 'Info2', value: 'TODO'},
  {label: 'Info3', value: 'TODO'},
  {label: 'Info4', value: 'TODO'},
  {label: 'Info5', value: 'TODO'},
]

const Row = withStyles(styles)(({children, classes}) => (
  <Grid container direction="row" justify="space-around" className={classes.row} spacing={24}>
    {children}
  </Grid>
))

// TODO: use real data
// TODO: format/style values inside this component

export default compose(
  withI18n,
  withStyles(styles)
)(({classes, i18n: {translate}}) => (
  <SimpleLayout title={translate(messages.header)} width="1200px">
    <Row>
      <Grid item xs={6}>
        <KeyValueCard header={<KeyValueCard.Header label="Card1" value="TODO" />}>
          <KeyValueCard.Body items={MOCKED_ITEMS} />
        </KeyValueCard>
      </Grid>
      <Grid item xs={6}>
        <KeyValueCard header={<KeyValueCard.Header label="Card2" value="TODO" />}>
          <KeyValueCard.Body items={MOCKED_ITEMS} />
        </KeyValueCard>
      </Grid>
    </Row>
    <Row>
      <Grid item xs={6}>
        <KeyValueCard header={<KeyValueCard.Header label="Card3" value="TODO" />}>
          <KeyValueCard.Body items={MOCKED_ITEMS} />
        </KeyValueCard>
      </Grid>
      <Grid item xs={6}>
        <KeyValueCard header={<KeyValueCard.Header label="Card4" value="TODO" />}>
          <KeyValueCard.Body items={MOCKED_ITEMS} />
        </KeyValueCard>
      </Grid>
    </Row>
  </SimpleLayout>
))
