// @flow
import React, {useCallback, useState} from 'react'
import cn from 'classnames'
import {Link} from 'react-router-dom'
import {defineMessages} from 'react-intl'
import gql from 'graphql-tag'
import {useMutation} from 'react-apollo-hooks'
import IsEmail from 'isemail'
import {Grid, Typography, TextField} from '@material-ui/core'
import {makeStyles} from '@material-ui/styles'
import {darken} from '@material-ui/core/styles/colorManipulator'

import {useI18n} from '@/i18n/helpers'
import {routeTo} from '@/helpers/routes'
import analytics from '@/helpers/googleAnalytics'
import {Button, ExternalLink, Tooltip} from '@/components/visual'
import logo from '../../assets/icons/logo-seiza-white.svg'

import fbIcon from '@/assets/icons/social/fb.svg'
import linkedInIcon from '@/assets/icons/social/linkedin.svg'
import mediumIcon from '@/assets/icons/social/medium.svg'
import redditIcon from '@/assets/icons/social/reddit.svg'
import twitterEmurgoIcon from '@/assets/icons/social/twitter-emurgo.svg'
import twitterSeizaIcon from '@/assets/icons/social/twitter-seiza.svg'
import youtubeIcon from '@/assets/icons/social/youtube.svg'

const messages = defineMessages({
  copyright: 'All rights reserved',
  subscribeToNewsletter: 'Subscribe to newsletter',
})

const subscribeMessages = defineMessages({
  subscribeHeader: "Let's stay in touch!",
  subscribeText:
    'Subscribe to Seiza to receive news and updates about staking, rewards and new features 🚀!',
  emailButton: 'Email',
  subscribeButton: 'Subscribe',
})

const SOCIAL_LINKS = {
  FACEBOOK: 'https://www.facebook.com/emurgo.io',
  YOUTUBE: 'https://www.youtube.com/channel/UCgFQ0hHuPO1QDcyP6t9KZTQ',
  MEDIUM: 'https://medium.com/@emurgo_io',
  REDDIT: 'https://reddit.com/r/cardano',
  TWITTER: 'https://twitter.com/emurgo_io',
  LINKEDIN: 'https://www.linkedin.com/company/emurgo_io',
}

const useRoundedInputStyles = makeStyles((theme) => {
  return {
    // Mui Input div
    Input: {
      '&>fieldset': {
        borderRadius: '35px',
        borderColor: '#9881DC !important',
      },
      'height': '100%',
    },
    // <input> element
    input: {
      padding: '8.5px 15px',
    },
  }
})

const RoundedInput = React.forwardRef((props, ref) => {
  const classes = useRoundedInputStyles()
  return (
    <TextField
      variant="outlined"
      InputProps={{className: classes.Input}}
      // (react-create-app complains about same props)
      // eslint-disable-next-line
      inputProps={{className: classes.input}}
      inputRef={ref}
      {...props}
    />
  )
})

const SUBSCRIBE_MUTATION = gql`
  mutation subscribeToNewsletter($email: String!) {
    subscribeToNewsletter(email: $email)
  }
`
const useSubscribeMutation = (email) => useMutation(SUBSCRIBE_MUTATION, {variables: {email}})

const useSubscribeFooterStyles = makeStyles(({palette, spacing}) => ({
  wrapper: {
    padding: spacing.unit * 2,
    background: palette.gradient,
  },
  subscribe: {
    marginLeft: spacing.unit * 1.3,
    marginRight: spacing.unit * 1.3,
    width: '200px',
  },
  email: {
    width: '280px',
    height: '100%',
  },
  row: {
    padding: spacing.unit,
  },
  subscribeHeadlineWrapper: {
    padding: spacing.unit * 1.5,
  },
}))

// TODO: Save subscribed boolean to local storage and hide this section
const SubscribeFooter = () => {
  const classes = useSubscribeFooterStyles()
  const {translate: tr} = useI18n()
  const [email, setEmail] = useState('')
  const subscribe = useSubscribeMutation(email)
  const onEmailChange = useCallback((event) => setEmail(event.target.value), [setEmail])
  const validateAndSubscribe = useCallback(
    (event) => {
      event.preventDefault()
      // TODO: some visual feedback for user in case of invalid email?
      if (IsEmail.validate(email)) {
        subscribe(email)
        setEmail('')
      }
      // TODO: Add some visual feedback for the user that he successfully subscribed / error ocurred
    },
    [email, subscribe]
  )

  return (
    <Grid
      className={classes.wrapper}
      container
      direction="column"
      justify="center"
      alignItems="center"
    >
      <Grid item className={classes.row}>
        <Grid container direction="column" alignItems="center">
          <div className={classes.subscribeHeadlineWrapper}>
            <Typography variant="h1">{tr(subscribeMessages.subscribeHeader)}</Typography>
          </div>
          <Typography variant="body1">{tr(subscribeMessages.subscribeText)}</Typography>
        </Grid>
      </Grid>

      <Grid item className={classes.row}>
        <form>
          <Grid container direction="row" justify="center" spacing={16}>
            <Grid item>
              <RoundedInput
                className={classes.email}
                placeholder={tr(subscribeMessages.emailButton)}
                type="email"
                onChange={onEmailChange}
              />
            </Grid>
            <Grid item>
              <Button
                rounded
                gradient
                className={cn(classes.subscribe)}
                type="submit"
                onClick={validateAndSubscribe}
              >
                {tr(subscribeMessages.subscribeButton)}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Grid>
    </Grid>
  )
}

const useMainFooterStyles = makeStyles(({spacing, palette, typography}) => ({
  socialIconWrapper: {
    marginLeft: spacing.unit * 1.7,
  },
  copyright: {
    color: palette.footer.contrastText,
    fontSize: typography.fontSize * 0.5,
  },
  nav: {
    listStyleType: 'none',
    padding: 0,
    margin: 0,
    marginBottom: spacing.unit,
    display: 'flex',
    justifyContent: 'space-between',
  },
  navigationWrapper: {
    minWidth: '450px',
  },
  wrapper: {
    backgroundColor: palette.footer.background,
    padding: `${spacing.unit * 2}px ${spacing.unit * 1.5}px`,
  },
  innerWrapper: {
    maxWidth: 900,
    margin: 'auto',
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
}))

const SocialIcon = ({to, icon, className, iconName}) => {
  const classes = useMainFooterStyles()

  const onClick = useCallback(() => {
    analytics.trackSocialIconLink(iconName)
  }, [iconName])

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
      <div className="d-flex">
        <Typography variant="caption" className={classes.disabled}>
          {label}
        </Typography>
      </div>
    </Tooltip>
  )
}

const MainFooter = ({navItems}) => {
  const classes = useMainFooterStyles()
  const {translate: tr} = useI18n()
  return (
    <div className={classes.wrapper}>
      <Grid
        container
        direction="row"
        justify="space-between"
        alignItems="flex-end"
        className={classes.innerWrapper}
      >
        <Grid item>
          <img alt="" src={logo} />
          <Typography className={classes.copyright}>
            {tr(messages.copyright)} | &#169;2019 EMURGO PTE. Ltd
          </Typography>
        </Grid>

        <Grid item className={classes.navigationWrapper}>
          <Grid container direction="column" justifyContent="center">
            <Grid item>
              <ul className={classes.nav}>
                {navItems.map(({link, label, disabledText}) => (
                  <li key={label}>
                    {disabledText ? (
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
              <Grid container justify="space-between" alignItems="center">
                <Grid item>
                  <Link className={classes.link} to={routeTo.subscribe()}>
                    <Typography variant="caption" className={classes.navText}>
                      {tr(messages.subscribeToNewsletter)}
                    </Typography>
                  </Link>
                </Grid>

                <Grid item>
                  <Grid container alignItems="center">
                    <SocialIcon to={SOCIAL_LINKS.FACEBOOK} icon={fbIcon} iconName="facebook" />
                    <SocialIcon
                      to={SOCIAL_LINKS.TWITTER}
                      icon={twitterEmurgoIcon}
                      iconName="emurgo twitter"
                    />
                    <SocialIcon
                      to={SOCIAL_LINKS.TWITTER}
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
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  )
}

type FooterProps = {|
  navItems: $ReadOnlyArray<{link: string, label: string, disabledText?: ?string}>,
|}

const Footer = ({navItems}: FooterProps) => (
  <React.Fragment>
    <SubscribeFooter />
    <MainFooter navItems={navItems} />
  </React.Fragment>
)

export default Footer
