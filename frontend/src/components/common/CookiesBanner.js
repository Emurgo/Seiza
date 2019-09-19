// @flow

import React from 'react'
import NoSSR from 'react-no-ssr'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import {Grid, Typography} from '@material-ui/core'
import {makeStyles} from '@material-ui/styles'
import {defineMessages, FormattedMessage} from 'react-intl'

import {Card, ContentSpacing, Button} from '@/components/visual'
import {Link} from '@/components/common'
import {routeTo} from '@/helpers/routes'
import {useI18n} from '@/i18n/helpers'
import {useAcceptCookies} from '@/components/context/acceptCookies'
import {useUserAgent} from '@/components/context/userAgent'

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
    zIndex: 20,
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
    marginBottom: theme.spacing(1),
    [theme.breakpoints.up('md')]: {
      textAlign: 'left',
    },
  },
  accept: {
    'color': theme.palette.primary.main,
    'cursor': 'pointer',
    ':hover': {
      textDecoration: 'underline',
    },
  },
}))

const useTransitionStyles = makeStyles((theme) => ({
  leave: {
    opacity: 1,
  },
  leaveActive: {
    opacity: 0,
    transition: 'opacity 1000ms',
  },
}))

const CookiesBanner = () => {
  const classes = useStyles()
  const {translate: tr} = useI18n()
  const {acceptCookies} = useAcceptCookies()

  return (
    <NoSSR>
      <Card className={classes.card}>
        <ContentSpacing top={0.6} bottom={0.6} left={0.6} right={0.6}>
          <Grid container alignItems="center" spacing={4}>
            <Grid item xs={12} md={2}>
              <Grid container justify="center">
                <img src="/static/assets/icons/cookies.svg" alt="" />
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
                <Button onClick={acceptCookies}>{tr(messages.confirm)}</Button>
              </Grid>
            </Grid>
          </Grid>
        </ContentSpacing>
      </Card>
    </NoSSR>
  )
}

const CookiesBannerWrapper = () => {
  const {cookiesAccepted} = useAcceptCookies()
  const {isCrawler} = useUserAgent()
  const classes = useTransitionStyles()

  const shouldShowBanner = !cookiesAccepted && !isCrawler

  return (
    /* No need to render this for crawlers/clients which don't run javascript*/
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
      {shouldShowBanner && <CookiesBanner />}
    </ReactCSSTransitionGroup>
  )
}

export default CookiesBannerWrapper
