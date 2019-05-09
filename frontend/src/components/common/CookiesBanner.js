// @flow

import React from 'react'
import {Grid, Typography, Fade} from '@material-ui/core'
import {makeStyles} from '@material-ui/styles'
import {defineMessages} from 'react-intl'

import {Card, Link, ContentSpacing, Button} from '@/components/visual'
import {useI18n} from '@/i18n/helpers'
import {useCookiesContext} from '@/components/context/CookiesContext'
import cookiesIcon from '@/assets/icons/cookies.svg'

const messages = defineMessages({
  header: 'We use cookies!',
  textPartOne:
    'Please accept cookies to enhance your browsing experience and to continue exploring our website.',
  textPartTwo: 'You can learn more about it',
  linkText: 'here', // How will this behave for other languages? :thinking-face,
  confirm: 'I accept cookies',
})

const useStyles = makeStyles((theme) => ({
  card: {
    width: '100%',
    maxWidth: 300,
    position: 'fixed',
    zIndex: 1,
    bottom: 0,
    right: 0,
    [theme.breakpoints.up('sm')]: {
      maxWidth: 400,
    },
    [theme.breakpoints.up('md')]: {
      maxWidth: 800,
      width: 800,
    },
  },
  header: {
    textAlign: 'center',
    fontWeight: 600,
    marginBottom: theme.spacing.unit,
    [theme.breakpoints.up('md')]: {
      textAlign: 'left',
    },
  },
}))

const CookiesBanner = () => {
  const classes = useStyles()
  const {translate: tr} = useI18n()
  const {cookiesAccepted, acceptCookies} = useCookiesContext()

  const show = !cookiesAccepted

  return (
    <Fade in={show} timeout={show ? 0 : 500}>
      <Card className={classes.card}>
        <ContentSpacing top={0.6} bottom={0.6} left={0.6} right={0.6}>
          <Grid container alignItems="center" spacing={16}>
            <Grid item xs={12} md={2}>
              <Grid container justify="center">
                <img src={cookiesIcon} alt="" />
              </Grid>
            </Grid>
            <Grid item xs={12} md={7}>
              <Grid container direction="column">
                <Typography variant="overline" className={classes.header}>
                  {tr(messages.header)}
                </Typography>
                <Typography>{tr(messages.textPartOne)}</Typography>
                <Typography>
                  {tr(messages.textPartTwo)} <Link to={null}>{tr(messages.linkText)}</Link>
                </Typography>
              </Grid>
            </Grid>
            <Grid item xs={12} md={3}>
              <Grid container justify="center">
                <Button onClick={acceptCookies} color="primary">
                  {tr(messages.confirm)}
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </ContentSpacing>
      </Card>
    </Fade>
  )
}

export default CookiesBanner
