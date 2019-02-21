// @flow

import React from 'react'
import classnames from 'classnames'
import {compose} from 'redux'
import {Link} from 'react-router-dom'
import {defineMessages} from 'react-intl'
import {Grid, withStyles, createStyles, Typography, Input} from '@material-ui/core'

import Button from './Button'
import {withI18n} from '@/i18n/helpers'
import logo from '@/tmp_assets/tmp-seiza-footer-icon.png'

// TODO: add flow types

const I18N_PREFIX = 'footer'
const SUBSCRIBE_PREFIX = `${I18N_PREFIX}.subscribe`

const subscribeMessages = defineMessages({
  subscribeHeader: {
    id: `${SUBSCRIBE_PREFIX}.header`,
    defaultMessage: "Let's stay in touch!",
  },
  subscribeText: {
    id: `${SUBSCRIBE_PREFIX}.text`,
    defaultMessage:
      'Get access to subscriber and be the first to know when we launch something new!',
  },
  emailButton: {
    id: `${SUBSCRIBE_PREFIX}.email`,
    defaultMessage: 'Email',
  },
  subscribeButton: {
    id: `${SUBSCRIBE_PREFIX}.subscribe`,
    defaultMessage: 'Subscribe',
  },
})

const styles = ({palette}) =>
  createStyles({
    nav: {
      listStyleType: 'none',
      display: 'flex',
    },
    link: {
      textDecoration: 'none',
    },
    navItem: {
      paddingLeft: '50px',
    },
    navText: {
      color: palette.secondary.contrastText,
    },
    topNav: {
      padding: '10px',
    },
    bottomNav: {
      backgroundColor: palette.secondary.dark,
    },
    bottomNavRow: {
      padding: '5px',
    },
    logo: {
      padding: '10px',
    },
    subscribe: {
      marginLeft: '10px',
      marginRight: '10px',
      borderRadius: '30px',
      width: '200px',
    },
    email: {
      marginLeft: '10px',
      marginRight: '10px',
      border: `1px solid ${palette.secondary.light}`,
      borderRadius: '35px',
      padding: '3px 10px',
      width: '200px',
    },
  })

const Footer = ({classes, navItems, i18n: {translate}}) => (
  <React.Fragment>
    <Grid
      className={classnames('gradient-bg', classes.topNav)}
      container
      direction="column"
      justify="center"
      alignItems="center"
    >
      <Grid item className={classes.bottomNavRow}>
        <Typography variant="h4">{translate(subscribeMessages.subscribeHeader)}</Typography>
      </Grid>
      <Grid item className={classes.bottomNavRow}>
        <Typography>{translate(subscribeMessages.subscribeText)}</Typography>
      </Grid>
      <Grid item className={classes.bottomNavRow}>
        <Grid container direction="row" justify="center">
          <Input
            disableUnderline
            className={classes.email}
            placeholder={translate(subscribeMessages.emailButton)}
            type="email"
          />
          <Button className={classnames(classes.subscribe, 'gradient-bg')} primary>
            {translate(subscribeMessages.subscribeButton)}
          </Button>
        </Grid>
      </Grid>
    </Grid>
    <Grid container direction="row" justify="center" className={classes.bottomNav}>
      <img className={classes.logo} alt="" src={logo} />
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
  </React.Fragment>
)

export default compose(
  withI18n,
  withStyles(styles)
)(Footer)
