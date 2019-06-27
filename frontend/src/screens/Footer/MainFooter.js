// @flow
import React, {useCallback} from 'react'
import cn from 'classnames'
import {Link} from 'react-router-dom'
import {defineMessages} from 'react-intl'
import {Grid, Typography} from '@material-ui/core'
import {makeStyles} from '@material-ui/styles'
import {darken} from '@material-ui/core/styles/colorManipulator'

import {useI18n} from '@/i18n/helpers'
import {useAnalytics} from '@/helpers/googleAnalytics'
import {ExternalLink, Tooltip} from '@/components/visual'
import logo from '@/static/assets/icons/logo-seiza-white.svg'
import {useSubscribeContext} from '@/components/context/SubscribeContext'

import fbIcon from '@/static/assets/icons/social/fb.svg'
import linkedInIcon from '@/static/assets/icons/social/linkedin.svg'
import mediumIcon from '@/static/assets/icons/social/medium.svg'
import redditIcon from '@/static/assets/icons/social/reddit.svg'
import twitterEmurgoIcon from '@/static/assets/icons/social/twitter-emurgo.svg'
import twitterSeizaIcon from '@/static/assets/icons/social/twitter-seiza.svg'
import youtubeIcon from '@/static/assets/icons/social/youtube.svg'

const messages = defineMessages({
  copyright: 'All rights reserved',
  subscribeToNewsletter: 'Subscribe to newsletter',
  subscribeInfo:
    'By subscribing, you agree to receive news and updates about our new features and products in accordance with our {privacyLink}.',
  privacyLink: 'Privacy and Cookie policy',
})

const SOCIAL_LINKS = {
  FACEBOOK: 'https://www.facebook.com/emurgo.io',
  YOUTUBE: 'https://www.youtube.com/channel/UCgFQ0hHuPO1QDcyP6t9KZTQ',
  MEDIUM: 'https://medium.com/@emurgo_io',
  REDDIT: 'https://reddit.com/r/cardano',
  TWITTER_EMURGO: 'https://twitter.com/emurgo_io',
  TWITTER_SEIZA: 'https://twitter.com/seiza_explorer',
  LINKEDIN: 'https://www.linkedin.com/company/emurgo_io',
}

const useMainFooterStyles = makeStyles(({spacing, palette, typography, breakpoints}) => ({
  socialIconWrapper: {
    marginLeft: 0,
    marginRight: spacing(2.5),
    marginTop: spacing(1),

    [breakpoints.up('md')]: {
      marginLeft: spacing(1.7),
      marginRight: 0,
      marginTop: 0,
    },
  },
  copyright: {
    color: palette.footer.contrastText,
    fontSize: typography.fontSize * 0.5,
  },
  nav: {
    'listStyleType': 'none',
    'padding': 0,
    'margin': 0,
    'marginBottom': spacing(1),
    'display': 'flex',
    'justifyContent': 'space-between',
    'flexDirection': 'column',
    [breakpoints.up('sm')]: {
      flexDirection: 'row',
    },
    '& > *': {
      marginTop: spacing(1.2),
      marginRight: spacing(2),
    },
    '& > :last-child': {
      marginRight: 0,
    },
    [breakpoints.up('md')]: {
      'marginTop': 0,
      '& > *': {
        marginRight: spacing(4),
      },
      '& > :last-child': {
        marginRight: 0,
      },
    },
  },
  navigationWrapper: {
    marginTop: spacing(2),
    [breakpoints.up('sm')]: {
      marginTop: spacing(2),
    },
    [breakpoints.up('md')]: {
      marginTop: 0,
    },
  },
  wrapper: {
    backgroundColor: palette.footer.background,
    padding: `${spacing(2)}px ${spacing(1.5)}px`,
  },
  innerWrapper: {
    justifyContent: 'space-between',
    maxWidth: 900,
    margin: 'auto',
    flexDirection: 'column',
    alignItems: 'flex-start',
    paddingLeft: spacing(3),

    [breakpoints.up('md')]: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      paddingLeft: 0,
    },
  },
  link: {
    'textDecoration': 'none',
    '&:hover': {
      textDecoration: 'underline',
      color: palette.background.paper,
    },
  },
  navText: {
    color: palette.footer.contrastText,
    fontWeight: 700,
  },
  disabled: {
    color: darken(palette.footer.contrastText, 0.25),
    pointerEvents: 'none',
  },
  subscribe: {
    cursor: 'pointer',
    height: '100%',
    fontSize: typography.fontSize * 0.7,
    marginTop: spacing(0.5),
    marginBottom: spacing(0.5),
    [breakpoints.up('sm')]: {
      marginTop: 0,
      marginBottom: 0,
    },
  },
  bottomBarContainer: {
    justifyContent: 'space-between',
    flexDirection: 'column',
    alignItems: 'flex-start',

    [breakpoints.up('md')]: {
      flexDirection: 'row',
      alignItems: 'center',
    },
  },
}))

const SocialIcon = ({to, icon, className, iconName}) => {
  const classes = useMainFooterStyles()
  const analytics = useAnalytics()

  const onClick = useCallback(() => {
    analytics.trackSocialIconLink(iconName)
  }, [analytics, iconName])

  return (
    <span className={classes.socialIconWrapper}>
      <ExternalLink to={to} target="_blank" onClick={onClick}>
        <img src={icon} alt="" />
      </ExternalLink>
    </span>
  )
}

const DisabledLink = ({label, disabledText}) => {
  const classes = useMainFooterStyles()
  return (
    <Tooltip title={disabledText}>
      {/* Tooltip is not shown without this wrapper */}
      <div>
        <Typography variant="caption" className={classes.disabled}>
          {label}
        </Typography>
      </div>
    </Tooltip>
  )
}

type Props = {
  // TODO: type me!
  navItems: any,
}

const MainFooter = ({navItems}: Props) => {
  const {showSubscribe, hidden} = useSubscribeContext()
  const classes = useMainFooterStyles()
  const {translate: tr} = useI18n()

  const onShowSubscribe = useCallback(() => {
    showSubscribe()
    setTimeout(
      // $FlowFixMe (scrollHeight) should be always defined
      () => window.scrollTo({left: 0, top: document.body.scrollHeight, behavior: 'smooth'}),
      600 // TODO: get rid of this ad-hoc value
    )
  }, [showSubscribe])

  return (
    <div className={classes.wrapper}>
      <Grid container className={classes.innerWrapper}>
        <Grid item>
          <img alt="" src={logo} />
          <Typography className={classes.copyright}>
            {tr(messages.copyright)} | &#169;2019 EMURGO PTE. Ltd
          </Typography>
        </Grid>

        <Grid item className={classes.navigationWrapper}>
          <Grid container direction="column" justify="center">
            <Grid item>
              <ul className={classes.nav}>
                {navItems.map(({link, label, disabledText}) => (
                  <li key={label}>
                    {!link ? (
                      <DisabledLink {...{label, disabledText}} />
                    ) : (
                      <Link className={classes.link} to={link}>
                        <Typography variant="caption" className={classes.navText}>
                          {label}
                        </Typography>
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </Grid>
            <Grid item>
              <Grid container className={classes.bottomBarContainer}>
                <Grid item>
                  {hidden && (
                    <Typography
                      variant="caption"
                      className={cn(classes.navText, classes.link, classes.subscribe)}
                      onClick={onShowSubscribe}
                    >
                      {tr(messages.subscribeToNewsletter)}
                    </Typography>
                  )}
                </Grid>

                <Grid item>
                  <Grid container alignItems="center">
                    <SocialIcon to={SOCIAL_LINKS.FACEBOOK} icon={fbIcon} iconName="facebook" />
                    <SocialIcon
                      to={SOCIAL_LINKS.TWITTER_EMURGO}
                      icon={twitterEmurgoIcon}
                      iconName="emurgo twitter"
                    />
                    <SocialIcon
                      to={SOCIAL_LINKS.TWITTER_SEIZA}
                      icon={twitterSeizaIcon}
                      iconName="seiza twitter"
                    />
                    <SocialIcon to={SOCIAL_LINKS.YOUTUBE} icon={youtubeIcon} iconName="youtube" />
                    <SocialIcon to={SOCIAL_LINKS.MEDIUM} icon={mediumIcon} iconName="medium" />
                    <SocialIcon to={SOCIAL_LINKS.REDDIT} icon={redditIcon} iconName="reddit" />
                    <SocialIcon
                      to={SOCIAL_LINKS.LINKEDIN}
                      icon={linkedInIcon}
                      iconName="linkedin"
                    />
                  </Grid>{' '}
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  )
}

export default MainFooter
