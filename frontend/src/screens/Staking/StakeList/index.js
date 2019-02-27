import React from 'react'
import _ from 'lodash'
import {compose} from 'redux'
import {Grid, createStyles, withStyles} from '@material-ui/core'

import StakePool from './StakePool'

const styles = () =>
  createStyles({
    rowWrapper: {
      padding: '15px 30px',
      width: '1000px',
    },
  })

const desc = `
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi ac erat lacinia, fermentum ante non, pharetra lectus.
Cras fermentum ante a efficitur consequat. Maecenas non lacus sed urna ultricies lobortis. Donec cursus elit eget blandit ultricies.
Etiam accumsan gravida eros at lacinia. Nunc mollis augue leo, non euismod nunc lacinia eget. In vitae diam tempor,
lacinia lectus nec, euismod eros. Pellentesque diam ligula, malesuada a pulvinar quis, viverra vitae magna.
Sed finibus tempus quam vitae gravida. Donec quis dolor at lacus consequat interdum.
Curabitur sagittis eu metus vitae dictum. Phasellus sit amet massa a ex ornare ullamcorper quis at ex. Vivamus sit amet tristique arcu.
`

const createStakePool = (index) => ({
  name: `Stake pool ${index}`,
  hash: `BWbpfVLvuesbv9QybgefRsfoXt6YDySMCTrSYvbC4${index}`,
  blocksCreated: '0.85',
  pledge: '142432243',
  margins: '0.3',
  creationDate: Date.now(),
  fullness: '0.6',
  stake: '43243243222242',
  desc,
})

const mockedStakePools = _.range(1, 10).map((i) => createStakePool(i))

const StakeList = ({classes}) => (
  <Grid container direction="column" alignItems="center">
    {mockedStakePools.map((pool) => (
      <Grid item key={pool.hash} className={classes.rowWrapper}>
        <StakePool data={pool} />
      </Grid>
    ))}
  </Grid>
)

export default compose(withStyles(styles))(StakeList)
