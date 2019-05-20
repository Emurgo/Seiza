// @flow
import React from 'react'
import {Link} from 'react-router-dom'
import {Grid} from '@material-ui/core'
import {makeStyles} from '@material-ui/styles'
import {Button} from '@/components/visual'
import {ReactComponent as NextIcon} from '@/assets/icons/next-epoch.svg'
import {ReactComponent as PreviousIcon} from '@/assets/icons/previous-epoch.svg'

const useStyles = makeStyles((theme) => ({
  navigationButton: {
    width: '250px',
    margin: '0 30px',
    position: 'relative',
  },
  prevIcon: {
    position: 'absolute',
    left: 15,
  },
  nextIcon: {
    position: 'absolute',
    right: 15,
  },
}))

type Props = {|
  hasPrev: boolean,
  linkPrev: ?string,
  prevMessage: string,
  hasNext: boolean,
  linkNext: ?string,
  nextMessage: string,
|}

const NavigationButtons = ({
  goPrev,
  hasPrev,
  linkPrev,
  prevMessage,
  hasNext,
  linkNext,
  nextMessage,
}: Props) => {
  const classes = useStyles()

  return (
    <Grid container direction="row" justify="center" spacing={16}>
      <Grid item>
        <Button
          rounded
          secondary
          className={classes.navigationButton}
          disabled={!hasPrev}
          /* Link requires `to` prop even if disabled */
          to={linkPrev || ''}
          component={Link}
        >
          <PreviousIcon className={classes.prevIcon} />
          {prevMessage}
        </Button>
      </Grid>
      <Grid item>
        <Button
          rounded
          secondary
          className={classes.navigationButton}
          disabled={!hasNext}
          /* Link requires `to` prop even if disabled */
          to={linkNext || ''}
          component={Link}
        >
          {nextMessage}
          <NextIcon className={classes.nextIcon} />
        </Button>
      </Grid>
    </Grid>
  )
}

export default NavigationButtons
