// @flow
import React, {useCallback, useState} from 'react'
import cn from 'classnames'
import {Link} from 'react-router-dom'
import {defineMessages, FormattedMessage} from 'react-intl'
import gql from 'graphql-tag'
import {useMutation} from 'react-apollo-hooks'
import IsEmail from 'isemail'
import idx from 'idx'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import {
  Grid,
  Typography,
  FormControl,
  FormHelperText,
  // $FlowFixMe: Weird error: Cannot import OutlinedInput from @material-ui/core.
  OutlinedInput,
} from '@material-ui/core'
import {makeStyles} from '@material-ui/styles'
import {darken} from '@material-ui/core/styles/colorManipulator'

import {useI18n} from '@/i18n/helpers'
import {routeTo} from '@/helpers/routes'
import {useAnalytics} from '@/helpers/googleAnalytics'
import {
  Button,
  ExternalLink,
  Tooltip,
  CloseIconButton,
  LoadingOverlay,
  Link as CustomLink,
} from '@/components/visual'
import logo from '@/assets/icons/logo-seiza-white.svg'
import alertIcon from '@/assets/icons/alert.svg'
import subscribedIcon from '@/assets/icons/subscribed.svg'
import {useSubscribeContext} from '@/components/context/SubscribeContext'

import fbIcon from '@/assets/icons/social/fb.svg'
import linkedInIcon from '@/assets/icons/social/linkedin.svg'
import mediumIcon from '@/assets/icons/social/medium.svg'
import redditIcon from '@/assets/icons/social/reddit.svg'
import twitterEmurgoIcon from '@/assets/icons/social/twitter-emurgo.svg'
import twitterSeizaIcon from '@/assets/icons/social/twitter-seiza.svg'
import youtubeIcon from '@/assets/icons/social/youtube.svg'

// TODO: divide footer to multiple files

const messages = defineMessages({
  copyright: 'All rights reserved',
  subscribeToNewsletter: 'Subscribe to newsletter',
  subscribeInfo:
    'By subscribing, you agree to receive news and updates about our new features and products in accordance with our {privacyLink}.',
  privacyLink: 'Privacy and Cookie policy',
})

const subscribeMessages = defineMessages({
  subscribeHeader: "Let's stay in touch!",
  subscribeText:
    'Subscribe to Seiza to receive news and updates about staking, rewards and new features 🚀!',
  emailButton: 'Email',
  subscribeButton: 'Subscribe',
  genericError: 'Sorry. An error occurred. Please try again.',
  invalidEmail: 'Incorrect format of Email',
  subscribeSuccess: 'You are successfully subscribed!',
})

const SOCIAL_LINKS = {
  FACEBOOK: 'https://www.facebook.com/emurgo.io',
  YOUTUBE: 'https://www.youtube.com/channel/UCgFQ0hHuPO1QDcyP6t9KZTQ',
  MEDIUM: 'https://medium.com/@emurgo_io',
  REDDIT: 'https://reddit.com/r/cardano',
  TWITTER_EMURGO: 'https://twitter.com/emurgo_io',
  TWITTER_SEIZA: 'https://twitter.com/seiza_com',
  LINKEDIN: 'https://www.linkedin.com/company/emurgo_io',
}

const useRoundedInputStyles = makeStyles((theme) => {
  return {
    input: {
      padding: '8.5px 15px',
    },
    errorLabel: {
      position: 'absolute',
      top: 0,
      right: 0,
      width: '90%',
    },
    formControl: {
      height: '100%',
    },
    errorIcon: {
      height: '70%',
    },
    relative: {
      position: 'relative',
    },
  }
})

const useOutlinedInputStyles = makeStyles(() => ({
  root: {
    height: '100%',
  },
  notchedOutline: {
    borderRadius: '35px',
    // TODO: get from theme
    borderColor: '#9881DC !important',
  },
}))

const RoundedInput = ({errorMessage, ...props}) => {
  const classes = useRoundedInputStyles()
  const outlinedInputClasses = useOutlinedInputStyles()
  return (
    <FormControl className={classes.formControl}>
      <OutlinedInput
        inputProps={{className: classes.input}}
        classes={outlinedInputClasses}
        endAdornment={
          errorMessage ? <img alt="" src={alertIcon} className={classes.errorIcon} /> : null
        }
        {...props}
      />
      {errorMessage && (
        <div className={classes.relative}>
          <FormHelperText error className={classes.errorLabel}>
            {errorMessage}
          </FormHelperText>
        </div>
      )}
    </FormControl>
  )
}

const SUBSCRIBE_MUTATION = gql`
  mutation subscribeToNewsletter($email: String!) {
    subscribeToNewsletter(email: $email)
  }
`
const useSubscribeMutation = (email) => useMutation(SUBSCRIBE_MUTATION, {variables: {email}})

const LARGEST_FOOTER_HEIGHT = 420

const useSubscribeFooterStyles = makeStyles(({palette, spacing, breakpoints, typography}) => ({
  '@global': {
    '@keyframes footer-leave': {
      '0%': {
        opacity: 1,
        maxHeight: LARGEST_FOOTER_HEIGHT,
      },
      '50%': {
        opacity: 0,
        maxHeight: LARGEST_FOOTER_HEIGHT,
      },
      '100%': {
        maxHeight: 0,
        padding: 0,
        opacity: 0,
      },
    },
    '@keyframes footer-enter': {
      '0%': {
        maxHeight: 0,
        padding: 0,
        opacity: 0,
      },
      '30%': {
        opacity: 0,
        maxHeight: LARGEST_FOOTER_HEIGHT,
      },
      '100%': {
        opacity: 1,
        maxHeight: LARGEST_FOOTER_HEIGHT,
      },
    },
  },
  'wrapper': {
    height: LARGEST_FOOTER_HEIGHT,
    overflow: 'hidden',
    padding: spacing.unit * 2,
    background: palette.gradient,
    position: 'relative',
    [breakpoints.up('sm')]: {
      height: 250,
    },
    [breakpoints.up('md')]: {
      height: 220,
    },
  },
  'subscribe': {
    marginLeft: spacing.unit * 1.3,
    marginRight: spacing.unit * 1.3,
    marginTop: spacing.unit,
    marginBottom: spacing.unit,
    width: '200px',
    [breakpoints.up('sm')]: {
      marginTop: 0,
      marginBottom: 0,
    },
  },
  'email': {
    width: '280px',
    height: '100%',
  },
  'row': {
    padding: spacing.unit,
  },
  'subscribeHeadlineWrapper': {
    padding: spacing.unit * 1.5,
  },
  'success': {
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  'successWrapper': {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  'hide': {
    position: 'absolute',
    top: 12,
    right: 12,
  },
  'initUILeave': {
    opacity: 1,
    transform: 'translateY(0px)',
  },
  'initUILeaveActive': {
    opacity: 0,
    transform: 'translateY(-100px)',
    transition: 'all 1s ease-in-out',
  },
  'successUIEnter': {
    opacity: 0,
    transform: 'translateX(100px)',
  },
  'successUIEnterActive': {
    opacity: 1,
    transition: 'all 1s ease-in-out 500ms',
    transform: 'translateX(0px)',
  },
  'leaveSubscribe': {}, // must be defined anyway
  'leaveSubscribeActive': {
    animation: 'footer-leave 1500ms',
  },
  'enterSubscribe': {}, // must be defined anyway
  'enterSubscribeActive': {
    animation: 'footer-enter 2000ms',
  },
  'subscribeInfo': {
    fontSize: typography.fontSize * 0.8,
  },
}))

type UiState = 'success' | 'error' | 'loading' | 'init'

const useUIState = (initialUIState: UiState) => {
  const [uiState, setUIState] = useState<UiState>('init')
  const [errorMessage, setErrorMessage] = useState(null)
  const setError = useCallback(
    (error) => {
      setUIState('error')
      setErrorMessage(error)
    },
    [setUIState]
  )
  const setLoading = useCallback(() => {
    setUIState('loading')
    setErrorMessage(null)
  }, [setUIState, setErrorMessage])

  const setSuccess = useCallback(() => {
    setUIState('success')
    setErrorMessage(null)
  }, [setUIState, setErrorMessage])

  const setInit = useCallback(() => {
    setUIState('init')
    setErrorMessage(null)
  }, [setUIState, setErrorMessage])

  return {
    uiState,
    setError,
    setLoading,
    setSuccess,
    setInit,
    errorMessage,
  }
}

const checkInvalidEmailError = (error) =>
  idx(error, (_) => _.graphQLErrors[0].extensions.code === 'INVALID_EMAIL')

const SubscribeFooter = () => {
  const classes = useSubscribeFooterStyles()
  const {translate: tr} = useI18n()
  const [email, setEmail] = useState('')
  const {hidden, hideSubscribe} = useSubscribeContext()
  const {uiState, setError, setInit, setSuccess, setLoading, errorMessage} = useUIState('init')
  const analytics = useAnalytics()

  const subscribe = useSubscribeMutation(email)

  const onHide = useCallback(() => {
    // setTimeout is used to avoid changing text while animating
    setTimeout(setInit)
    setEmail('')
    hideSubscribe()
  }, [hideSubscribe, setInit])

  const onEmailChange = useCallback((event) => setEmail(event.target.value), [setEmail])

  const setInvalidEmailError = useCallback(
    (event) => {
      setError(tr(subscribeMessages.invalidEmail))
    },
    [setError, tr]
  )

  const validateAndSubscribe = useCallback(
    (event) => {
      // Do we want to track only if email was valid?
      analytics.trackSubscription()
      event.preventDefault()
      if (!IsEmail.validate(email)) {
        setInvalidEmailError()
      } else {
        setLoading()
        subscribe(email)
          .then((res) => {
            if (res.data.subscribeToNewsletter) {
              setSuccess()
              setEmail('')
              setTimeout(onHide, 5000)
            } else {
              throw new Error('SubscribeError')
            }
          })
          .catch((error) => {
            const isEmailInvalidError = checkInvalidEmailError(error)
            isEmailInvalidError
              ? setInvalidEmailError()
              : setError(tr(subscribeMessages.genericError))
          })
      }
    },
    [
      analytics,
      email,
      setInvalidEmailError,
      setLoading,
      subscribe,
      setSuccess,
      onHide,
      setError,
      tr,
    ]
  )

  return (
    <ReactCSSTransitionGroup
      transitionName={{
        enter: classes.enterSubscribe,
        enterActive: classes.enterSubscribeActive,
        leave: classes.leaveSubscribe,
        leaveActive: classes.leaveSubscribeActive,
      }}
      transitionLeave
      transitionEnter
      transitionAppear={false}
      component="div"
    >
      {!hidden && (
        <Grid
          className={classes.wrapper}
          container
          direction="column"
          justify="center"
          alignItems="center"
        >
          <ReactCSSTransitionGroup
            transitionName={{
              enter: classes.successUIEnter,
              enterActive: classes.successUIEnterActive,
              appear: classes.successUIEnter,
              appearActive: classes.successUIEnterActive,
            }}
            transitionLeave={false}
            transitionEnter
            transitionAppear
            component={React.Fragment}
          >
            {uiState === 'success' && (
              <Grid
                container
                direction="column"
                justify="center"
                alignItems="center"
                className={classes.successWrapper}
              >
                <Grid item>
                  <Typography className={classes.success} variant="body1">
                    {tr(subscribeMessages.subscribeSuccess)}
                  </Typography>
                </Grid>
                <Grid item>
                  <img alt="" src={subscribedIcon} />
                </Grid>
              </Grid>
            )}
          </ReactCSSTransitionGroup>
          <ReactCSSTransitionGroup
            transitionName={{
              leave: classes.initUILeave,
              leaveActive: classes.initUILeaveActive,
            }}
            transitionLeave
            transitionEnter={false}
            transitionAppear={false}
          >
            {['error', 'loading', 'init'].includes(uiState) && (
              <div>
                <Grid item className={classes.row}>
                  <Grid container direction="column" alignItems="center">
                    <div className={classes.subscribeHeadlineWrapper}>
                      <Typography variant="h1">{tr(subscribeMessages.subscribeHeader)}</Typography>
                    </div>
                    <Typography variant="body1">{tr(subscribeMessages.subscribeText)}</Typography>
                  </Grid>
                </Grid>

                <Grid item className={classes.row}>
                  <Typography className={classes.subscribeInfo}>
                    <FormattedMessage
                      // $FlowFixMe
                      id={messages.subscribeInfo.id}
                      values={{
                        privacyLink: (
                          <CustomLink to={routeTo.privacy()}>{tr(messages.privacyLink)}</CustomLink>
                        ),
                      }}
                    />
                  </Typography>
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
                          errorMessage={errorMessage}
                          aria-describedby="error-text"
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
              </div>
            )}
          </ReactCSSTransitionGroup>

          {uiState !== 'loading' && (
            <CloseIconButton
              aria-label="Hide-subscribe-footer"
              className={classes.hide}
              onClick={onHide}
            />
          )}
          <LoadingOverlay loading={uiState === 'loading'} />
        </Grid>
      )}
    </ReactCSSTransitionGroup>
  )
}

const useMainFooterStyles = makeStyles(({spacing, palette, typography, breakpoints}) => ({
  socialIconWrapper: {
    marginLeft: 0,
    marginRight: spacing.unit * 1.7,
    marginTop: spacing.unit,

    [breakpoints.up('md')]: {
      marginLeft: spacing.unit * 1.7,
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
    'marginBottom': spacing.unit,
    'display': 'flex',
    'justifyContent': 'space-between',
    'flexDirection': 'column',
    [breakpoints.up('sm')]: {
      flexDirection: 'row',
    },
    '& > *': {
      marginTop: spacing.unit * 0.5,
      marginRight: spacing.unit * 2,
    },
    '& > :last-child': {
      marginRight: 0,
    },
    [breakpoints.up('md')]: {
      'marginTop': 0,
      '& > *': {
        marginRight: spacing.unit * 4,
      },
      '& > :last-child': {
        marginRight: 0,
      },
    },
  },
  navigationWrapper: {
    marginTop: spacing.unit * 2,
    [breakpoints.up('sm')]: {
      marginTop: spacing.unit * 2,
    },
    [breakpoints.up('md')]: {
      marginTop: 0,
    },
  },
  wrapper: {
    backgroundColor: palette.footer.background,
    padding: `${spacing.unit * 2}px ${spacing.unit * 1.5}px`,
  },
  innerWrapper: {
    justifyContent: 'space-between',
    maxWidth: 900,
    margin: 'auto',
    flexDirection: 'column',
    alignItems: 'flex-start',
    paddingLeft: spacing.unit * 3,

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
    marginTop: spacing.unit * 0.5,
    marginBottom: spacing.unit * 0.5,
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
      <div className="d-flex">
        <Typography variant="caption" className={classes.disabled}>
          {label}
        </Typography>
      </div>
    </Tooltip>
  )
}

const MainFooter = ({navItems}) => {
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
