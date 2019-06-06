// @flow

import React from 'react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import {Grid, Typography} from '@material-ui/core'
import {makeStyles} from '@material-ui/styles'
import {defineMessages, FormattedMessage} from 'react-intl'

import {Card, Link, ContentSpacing, Button} from '@/components/visual'
import {routeTo} from '@/helpers/routes'
import {useI18n} from '@/i18n/helpers'
import {useCookiesContext} from '@/components/context/CookiesContext'
import cookiesIcon from '@/assets/icons/cookies.svg'
import {isCrawler} from '@/helpers/userAgent'

const messages = defineMessages({
  header: 'We use cookies!',
  cookieBannerText:
    'This website uses cookies to offer you a better browsing experience and anonymous analytics in order to continuously improve our services. You can agree to our use of cookies by clicking {accept}.{break}Want to know more? Check out our {privacyLink}.',
  confirm: 'I accept cookies',
  privacyLink: 'Privacy and Cookies Policy',
  accept: 'Accept',
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
      maxWidth: 850,
      width: 850,
    },
    [theme.breakpoints.up('xl')]: {
      right: 'calc((100% - 1920px) / 2)',
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
  leave: {
    opacity: 1,
  },
  leaveActive: {
    opacity: 0,
    transition: 'opacity 1000ms',
  },
  accept: {
    'color': theme.palette.primary.main,
    'cursor': 'pointer',
    ':hover': {
      textDecoration: 'underline',
    },
  },
}))

const CookiesBanner = () => {
  const classes = useStyles()
  const {translate: tr} = useI18n()
  const {cookiesAccepted, acceptCookies} = useCookiesContext()

  return (
    <ReactCSSTransitionGroup
      transitionName={{
        leave: classes.leave,
        leaveActive: classes.leaveActive,
      }}
      transitionLeave
      transitionLeaveTimeout={1000}
      transitionAppear={false}
      transitionEnter={false}
    >
      {!cookiesAccepted && !isCrawler && (
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
                  <Typography>
                    <FormattedMessage
                      // $FlowFixMe (flow does not know about `id`)
                      id={messages.cookieBannerText.id}
                      values={{
                        accept: (
                          <span className={classes.accept} onClick={acceptCookies}>
                            {tr(messages.accept)}
                          </span>
                        ),
                        privacyLink: <Link to={routeTo.privacy()}>{tr(messages.privacyLink)}</Link>,
                        break: <br />,
                      }}
                    />
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
      )}
    </ReactCSSTransitionGroup>
  )
}

export default CookiesBanner
