// @flow
import React from 'react'
import cn from 'classnames'
import {Link} from 'react-router-dom'
import {Grid} from '@material-ui/core'
import {makeStyles} from '@material-ui/styles'
import {Button} from '@/components/visual'
import {ReactComponent as NextIcon} from '@/static/assets/icons/next-epoch.svg'
import {ReactComponent as PreviousIcon} from '@/static/assets/icons/previous-epoch.svg'

const useStyles = makeStyles((theme) => ({
  wrapper: {
    maxWidth: 600,
    alignSelf: 'center',
  },
  navigationButtonWrapper: {
    display: 'flex',
    flex: 1,
  },
  navigationButton: {
    display: 'flex',
    flex: 1,
    justifyContent: 'space-between',
  },
  prevButton: {
    marginRight: theme.spacing.unit,
  },
  nextButton: {
    marginLeft: theme.spacing.unit,
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

// to fix layout of arrow on the side and text in the center of the container
// 24px - width of arrow icon
const PhantomPlaceholder = () => <span style={{width: 24}} />

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
    <Grid container direction="row" justify="center" className={classes.wrapper}>
      <Grid item className={classes.navigationButtonWrapper}>
        <Button
          rounded
          secondaryGradient
          className={cn(classes.prevButton, classes.navigationButton)}
          disabled={!hasPrev}
          /* Link requires `to` prop even if disabled */
          to={linkPrev || ''}
          component={Link}
        >
          <PreviousIcon />
          {prevMessage}
          <PhantomPlaceholder />
        </Button>
      </Grid>

      <Grid item className={classes.navigationButtonWrapper}>
        <Button
          rounded
          secondaryGradient
          className={cn(classes.nextButton, classes.navigationButton)}
          disabled={!hasNext}
          /* Link requires `to` prop even if disabled */
          to={linkNext || ''}
          component={Link}
        >
          <PhantomPlaceholder />
          {nextMessage}
          <NextIcon />
        </Button>
      </Grid>
    </Grid>
  )
}

export default NavigationButtons
