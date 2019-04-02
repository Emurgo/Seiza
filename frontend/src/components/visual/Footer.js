// @flow

import React from 'react'
import classnames from 'classnames'
import {Link} from 'react-router-dom'
import {defineMessages} from 'react-intl'
import {Grid, Typography, TextField} from '@material-ui/core'
import {makeStyles} from '@material-ui/styles'

import {useI18n} from '@/i18n/helpers'
import {Button, ExternalLink} from '@/components/visual'
import logo from '../../assets/icons/logo-seiza-white.svg'

const messages = defineMessages({
  copyright: 'All rights reserved',
})

const subscribeMessages = defineMessages({
  subscribeHeader: "Let's stay in touch!",
  subscribeText: 'Get access to subscriber and be the first to know when we launch something new!',
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
      },
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

const useSubscribeFooterStyles = makeStyles(({palette}) => ({
  wrapper: {
    padding: '10px',
    background: palette.gradient,
  },
  subscribe: {
    marginLeft: '10px',
    marginRight: '10px',
    width: '200px',
  },
  email: {
    width: '200px',
  },
  row: {
    padding: '5px',
  },
}))

const SubscribeFooter = () => {
  const classes = useSubscribeFooterStyles()
  const {translate: tr} = useI18n()

  return (
    <Grid
      className={classes.wrapper}
      container
      direction="column"
      justify="center"
      alignItems="center"
    >
      <Grid item className={classes.row}>
        <Typography variant="h1">{tr(subscribeMessages.subscribeHeader)}</Typography>
      </Grid>
      <Grid item className={classes.row}>
        <Typography variant="body1">{tr(subscribeMessages.subscribeText)}</Typography>
      </Grid>
      <Grid item className={classes.row}>
        <Grid container direction="row" justify="center">
          <form>
            <RoundedInput
              className={classes.email}
              placeholder={tr(subscribeMessages.emailButton)}
              type="email"
            />
            <Button rounded gradient className={classnames(classes.subscribe)} type="submit">
              {tr(subscribeMessages.subscribeButton)}
            </Button>
          </form>
        </Grid>
      </Grid>
    </Grid>
  )
}

const useMainFooterStyles = makeStyles(({spacing, palette}) => ({
  socialIcon: {
    color: palette.footer.contrastText,
  },
  socialIconWrapper: {
    marginRight: spacing.unit * 1.4,
    marginBottom: spacing.unit * 0.75,
  },
  copyright: {
    color: palette.footer.contrastText,
    fontSize: 10,
    paddingBottom: spacing.unit * 2,
  },
  logo: {
    paddingBottom: spacing.unit,
    paddingTop: spacing.unit,
  },
  nav: {
    listStyleType: 'none',
    display: 'flex',
  },
  wrapper: {
    backgroundColor: palette.footer.background,
  },
  link: {
    'textDecoration': 'none',
    '&:hover': {
      textDecoration: 'underline',
      color: palette.background.paper,
    },
  },
  navItem: {
    paddingLeft: '50px',
  },
  navText: {
    color: palette.footer.contrastText,
  },
}))

const SocialIcon = ({to, className}) => {
  const classes = useMainFooterStyles()
  return (
    <span className={classes.socialIconWrapper}>
      <ExternalLink to={to}>
        <i className={classnames(classes.socialIcon, className)} />
      </ExternalLink>
    </span>
  )
}

const MainFooter = ({navItems}) => {
  const classes = useMainFooterStyles()
  const {translate: tr} = useI18n()
  return (
    <Grid container direction="row" justify="center" className={classes.wrapper}>
      <Grid item>
        <Grid container direction="column" alignItems="flex-start">
          <Grid item>
            <img className={classes.logo} alt="" src={logo} />
          </Grid>
          <Grid item>
            <Grid container justify="center" alignItems="center">
              <SocialIcon to={SOCIAL_LINKS.FACEBOOK} className="fa fa-facebook-square" />
              <SocialIcon to={SOCIAL_LINKS.TWITTER} className="fa fa-twitter" />
              <SocialIcon to={SOCIAL_LINKS.YOUTUBE} className="fa fa-youtube-play" />
              <SocialIcon to={SOCIAL_LINKS.MEDIUM} className="fa fa-medium" />
              <SocialIcon to={SOCIAL_LINKS.REDDIT} className="fa fa-reddit-alien" />
              <SocialIcon to={SOCIAL_LINKS.LINKEDIN} className="fa fa-linkedin-square" />
            </Grid>
          </Grid>
          <Grid item>
            <Typography className={classes.copyright}>
              {tr(messages.copyright)} | &#169;2019 EMURGO Co., Ltd
            </Typography>
          </Grid>
        </Grid>
      </Grid>

      <ul className={classes.nav}>
        {navItems.map(({link, label}) => (
          <li key={label} className={classes.navItem}>
            <Link className={classes.link} to={link}>
              <Typography className={classes.navText}>{label}</Typography>
            </Link>
          </li>
        ))}
      </ul>
    </Grid>
  )
}

type FooterProps = {|
  navItems: $ReadOnlyArray<{link: string, label: string}>,
|}

const Footer = ({navItems}: FooterProps) => (
  <React.Fragment>
    <SubscribeFooter />
    <MainFooter navItems={navItems} />
  </React.Fragment>
)

export default Footer
