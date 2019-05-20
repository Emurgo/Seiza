// @flow
import React, {useCallback, useState} from 'react'
import cn from 'classnames'
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

import {useI18n} from '@/i18n/helpers'
import {routeTo} from '@/helpers/routes'
import {useAnalytics} from '@/helpers/googleAnalytics'
import {Button, CloseIconButton, LoadingOverlay, Link as CustomLink} from '@/components/visual'
import alertIcon from '@/assets/icons/alert.svg'
import subscribedIcon from '@/assets/icons/subscribed.svg'
import {useSubscribeContext} from '@/components/context/SubscribeContext'

const messages = defineMessages({
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
    paddingTop: spacing.unit * 1.5,
    paddingBottom: spacing.unit * 1.5,
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

const MainAppearLeaveTransition = ({children}: {children: React$Node}) => {
  const classes = useSubscribeFooterStyles()
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
      {children}
    </ReactCSSTransitionGroup>
  )
}

const EnterTransition = ({children}: {children: React$Node}) => {
  const classes = useSubscribeFooterStyles()
  return (
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
      {children}
    </ReactCSSTransitionGroup>
  )
}

const LeaveTransition = ({children}: {children: React$Node}) => {
  const classes = useSubscribeFooterStyles()
  return (
    <ReactCSSTransitionGroup
      transitionName={{
        leave: classes.initUILeave,
        leaveActive: classes.initUILeaveActive,
      }}
      transitionLeave
      transitionEnter={false}
      transitionAppear={false}
    >
      {children}
    </ReactCSSTransitionGroup>
  )
}

const SubscribeFooter = () => {
  const classes = useSubscribeFooterStyles()
  const {translate: tr} = useI18n()
  const analytics = useAnalytics()

  const [email, setEmail] = useState('')
  const {hidden, hideSubscribe} = useSubscribeContext()
  const {uiState, setError, setInit, setSuccess, setLoading, errorMessage} = useUIState('init')
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
    <MainAppearLeaveTransition>
      {!hidden && (
        <Grid
          className={classes.wrapper}
          container
          direction="column"
          justify="center"
          alignItems="center"
        >
          <EnterTransition>
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
          </EnterTransition>
          <LeaveTransition>
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
          </LeaveTransition>

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
    </MainAppearLeaveTransition>
  )
}

export default SubscribeFooter
