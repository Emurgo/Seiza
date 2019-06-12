import {SimpleLayout} from '@/components/visual'

import React from 'react'
import {Grid} from '@material-ui/core'

const Section = ({title, children}) => (
  <SimpleLayout title={title} maxWidth="1200px">
    {children}
  </SimpleLayout>
)

const Row = ({children}) => (
  <Grid item>
    <Grid container direction="row" justify="space-around" spacing={24}>
      {children}
    </Grid>
  </Grid>
)

const Item = ({children}) => (
  <Grid item xs={12} sm={10} md={6}>
    {children}
  </Grid>
)

export default {
  Section,
  Row,
  Item,
}
