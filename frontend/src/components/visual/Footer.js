// @flow

import React from 'react'
import classnames from 'classnames'
import {compose} from 'redux'
import {Link} from 'react-router-dom'
import {defineMessages} from 'react-intl'
import {Grid, withStyles, createStyles, Typography, TextField} from '@material-ui/core'
import {makeStyles} from '@material-ui/styles'
import {Button} from '@/components/visual'
import {withI18n} from '@/i18n/helpers'
import logo from '../../assets/icons/logo-seiza-white.svg'

const subscribeMessages = defineMessages({
  subscribeHeader: "Let's stay in touch!",
  subscribeText: 'Get access to subscriber and be the first to know when we launch something new!',
  emailButton: 'Email',
  subscribeButton: 'Subscribe',
})

const styles = ({palette}) =>
  createStyles({
    nav: {
      listStyleType: 'none',
      display: 'flex',
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
    topNav: {
      padding: '10px',
      background: palette.gradient,
    },
    bottomNav: {
      backgroundColor: palette.text.primary,
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
      width: '200px',
    },
    email: {
      width: '200px',
    },
  })

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

const Footer = ({classes, navItems, i18n: {translate}}) => (
  <React.Fragment>
    <Grid
      className={classes.topNav}
      container
      direction="column"
      justify="center"
      alignItems="center"
    >
      <Grid item className={classes.bottomNavRow}>
        <Typography variant="h1">{translate(subscribeMessages.subscribeHeader)}</Typography>
      </Grid>
      <Grid item className={classes.bottomNavRow}>
        <Typography variant="body1">{translate(subscribeMessages.subscribeText)}</Typography>
      </Grid>
      <Grid item className={classes.bottomNavRow}>
        <Grid container direction="row" justify="center">
          <form>
            <RoundedInput
              className={classes.email}
              placeholder={translate(subscribeMessages.emailButton)}
              type="email"
            />
            <Button rounded gradient className={classnames(classes.subscribe)} type="submit">
              {translate(subscribeMessages.subscribeButton)}
            </Button>
          </form>
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
