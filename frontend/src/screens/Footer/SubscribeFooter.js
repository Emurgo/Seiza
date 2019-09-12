// @flow
import React, {useCallback, useState, useMemo} from 'react'
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
import {fade} from '@material-ui/core/styles/colorManipulator'

import {useI18n} from '@/i18n/helpers'
import {routeTo} from '@/helpers/routes'
import {useAnalytics} from '@/components/context/googleAnalytics'
import {Button, CloseIconButton} from '@/components/visual'
import {LoadingOverlay, Link as CustomLink} from '@/components/common'
import alertIcon from '@/static/assets/icons/alert.svg'
import subscribedIcon from '@/static/assets/icons/subscribed.svg'
import {ReactComponent as Rocket} from '@/static/assets/icons/emoji/rocket.svg'
import {useSubscribe} from './context/subscribe'

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
    'Subscribe to Seiza to receive news and updates about staking, rewards and new features!',
  emailButton: 'Email',
  subscribeButton: 'Subscribe',
  genericError: 'Sorry. An error occurred. Please try again later.',
  invalidEmail: 'Incorrect format of email',
  subscribeSuccess: 'You are successfully subscribed!',
})

const MATERIAL_UI_DEFAULT_TOP_PADDING = 8.5

const paddingSides = {
  paddingLeft: MATERIAL_UI_DEFAULT_TOP_PADDING * 2.5,
  paddingRight: MATERIAL_UI_DEFAULT_TOP_PADDING * 2.5,
}

const useRoundedInputStyles = makeStyles((theme) => {
  return {
    input: {
      paddingTop: MATERIAL_UI_DEFAULT_TOP_PADDING,
      paddingBottom: MATERIAL_UI_DEFAULT_TOP_PADDING,
      ...paddingSides,
    },
    errorLabel: paddingSides,
    formControl: {
      height: '100%',
    },
    errorIcon: {
      height: '70%',
    },
  }
})

const useOutlinedInputStyles = makeStyles((theme) => ({
  root: {
    'height': '100%',
    // See https://github.com/mui-org/material-ui/issues/13347#issuecomment-435790274
    // for the source of this abomination
    '&:hover:not($disabled):not($focused):not($error) $notchedOutline': {
      borderColor: `${theme.palette.primary.main} !important`,
    },
  },
  notchedOutline: {
    borderRadius: '35px',
    borderColor: `${fade(theme.palette.primary.main, 0.4)} !important`,
  },
  // Following two classes need to be here so that root's pseudoselector
  // won't complain
  disabled: {},
  error: {},
  focused: {
    '&>fieldset': {
      borderWidth: '1px !important',
      borderColor: `${theme.palette.primary.main} !important`,
    },
  },
}))

const RoundedInput = ({errorMessage, ...props}) => {
  const classes = useRoundedInputStyles()
  const outlinedInputClasses = useOutlinedInputStyles()
  const inputProps = useMemo(() => ({className: classes.input}), [classes.input])
  const endAdornment = useMemo(
    () => (errorMessage ? <img alt="" src={alertIcon} className={classes.errorIcon} /> : null),
    [classes.errorIcon, errorMessage]
  )
  return (
    <FormControl className={classes.formControl}>
      <OutlinedInput
        labelWidth={0}
        inputProps={inputProps}
        classes={outlinedInputClasses}
        endAdornment={endAdornment}
        {...props}
      />
      <FormHelperText error className={classes.errorLabel}>
        {errorMessage}
      </FormHelperText>
    </FormControl>
  )
}

const SUBSCRIBE_MUTATION = gql`
  mutation subscribeToNewsletter($email: String!) {
    subscribeToNewsletter(email: $email)
  }
`
const useSubscribeMutation = (email) => useMutation(SUBSCRIBE_MUTATION, {variables: {email}})

const LARGEST_FOOTER_HEIGHT = 450

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
    padding: spacing(2),
    paddingTop: spacing(4), // to countermeasure error label
    background: palette.gradient,
    position: 'relative',
    [breakpoints.up('sm')]: {
      height: 280,
    },
    [breakpoints.up('md')]: {
      height: 250,
    },
  },
  'subscribe': {
    marginLeft: spacing(1.3),
    marginRight: spacing(1.3),
    width: '200px',
    [breakpoints.up('sm')]: {
      marginTop: 0,
      marginBottom: 0,
    },
  },
  'email': {
    width: 280,
    height: 49, // 49 is height of subscribe button
  },
  'textfieldButtonSpacing': {
    padding: spacing(1),
  },
  'row': {
    padding: spacing(1),
  },
  'subscribeHeadlineWrapper': {
    paddingTop: spacing(1.5),
    paddingBottom: spacing(1.5),
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
  'rocket': {
    marginBottom: -4,
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
  idx(error, (_) => _.graphQLErrors[0].extensions.code === 'BAD_USER_INPUT')

const showSubscribeStates = ['error', 'loading', 'init']

const SubscribeFooter = () => {
  const classes = useSubscribeFooterStyles()
  const {translate: tr} = useI18n()
  const [email, setEmail] = useState('')
  const {hidden, hideSubscribe} = useSubscribe()
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

  const mainTransitionName = useMemo(
    () => ({
      enter: classes.enterSubscribe,
      enterActive: classes.enterSubscribeActive,
      leave: classes.leaveSubscribe,
      leaveActive: classes.leaveSubscribeActive,
    }),
    [
      classes.enterSubscribe,
      classes.enterSubscribeActive,
      classes.leaveSubscribe,
      classes.leaveSubscribeActive,
    ]
  )

  const enterTransitionName = useMemo(
    () => ({
      enter: classes.successUIEnter,
      enterActive: classes.successUIEnterActive,
      appear: classes.successUIEnter,
      appearActive: classes.successUIEnterActive,
    }),
    [classes.successUIEnter, classes.successUIEnterActive]
  )

  const leaveTransitionName = useMemo(
    () => ({
      leave: classes.initUILeave,
      leaveActive: classes.initUILeaveActive,
    }),
    [classes.initUILeave, classes.initUILeaveActive]
  )

  const subscribeInfoFormatted = useMemo(
    () => ({
      privacyLink: <CustomLink to={routeTo.privacy()}>{tr(messages.privacyLink)}</CustomLink>,
    }),
    [tr]
  )

  return (
    <ReactCSSTransitionGroup
      transitionName={mainTransitionName}
      transitionLeave
      transitionLeaveTimeout={1500}
      transitionEnter
      transitionEnterTimeout={2000}
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
            transitionName={enterTransitionName}
            transitionLeave={false}
            transitionEnter
            transitionEnterTimeout={500}
            transitionAppear
            transitionAppearTimeout={500}
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
            transitionName={leaveTransitionName}
            transitionLeave
            transitionLeaveTimeout={1000}
            transitionEnter={false}
            transitionAppear={false}
          >
            {showSubscribeStates.includes(uiState) && (
              <div>
                <Grid item className={classes.row}>
                  <Grid container direction="column" alignItems="center">
                    <div className={classes.subscribeHeadlineWrapper}>
                      <Typography variant="h1">{tr(subscribeMessages.subscribeHeader)}</Typography>
                    </div>
                    <Typography variant="body1">
                      {tr(subscribeMessages.subscribeText)}
                      <Rocket className={classes.rocket} />
                    </Typography>
                  </Grid>
                </Grid>

                <Grid item className={classes.row}>
                  <Typography variant="caption">
                    <FormattedMessage
                      // $FlowFixMe
                      id={messages.subscribeInfo.id}
                      values={subscribeInfoFormatted}
                    />
                  </Typography>
                </Grid>

                <Grid item className={classes.row}>
                  <form>
                    <Grid container direction="row" justify="center">
                      <Grid item className={classes.textfieldButtonSpacing}>
                        <RoundedInput
                          className={classes.email}
                          placeholder={tr(subscribeMessages.emailButton)}
                          type="email"
                          onChange={onEmailChange}
                          errorMessage={errorMessage}
                          aria-describedby="error-text"
                        />
                      </Grid>
                      <Grid item className={classes.textfieldButtonSpacing}>
                        <Button
                          rounded
                          gradient
                          variant="contained"
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
            <div className={classes.hide}>
              <CloseIconButton aria-label="Hide-subscribe-footer" onClick={onHide} />
            </div>
          )}
          <LoadingOverlay loading={uiState === 'loading'} />
        </Grid>
      )}
    </ReactCSSTransitionGroup>
  )
}

export default SubscribeFooter
