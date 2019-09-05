// @flow
import React from 'react'
import type {Node} from 'react'
import cn from 'classnames'
import {defineMessages} from 'react-intl'
import {Paper, Grid, Typography} from '@material-ui/core'
import {darken} from '@material-ui/core/styles/colorManipulator'
import {makeStyles} from '@material-ui/styles'

import emphasisIcon from '@/static/assets/icons/emphasis.svg'
import warningIcon from '@/static/assets/icons/warning.svg'
import alertIcon from '@/static/assets/icons/alert.svg'
import noResultsIcon from '@/static/assets/icons/sad-smile.svg'
import {useI18n} from '@/i18n/helpers'
import {CloseIconButton} from '@/components/visual'

const TYPES = Object.freeze({
  EMPHASIS: 'emphasis',
  WARNING: 'warning',
  ALERT: 'alert',
  NO_RESULTS: 'noResults',
  NEUTRAL: 'neutral',
})
type AlertTypeEnum = $Values<typeof TYPES>

// Note: babel-plugin-react-intl-auto cannot handle member expressions
const messages = defineMessages({
  emphasis: 'Emphasis',
  warning: 'Warning',
  alert: 'Alert',
  noResults: 'No results',
  neutral: 'Message',
})

const getBorderColorStyle = (backgroundColor) => darken(backgroundColor, 0.05)

const useAppStyles = makeStyles((theme) => ({
  wrapper: {
    paddingTop: theme.getContentSpacing(0.25),
    paddingBottom: theme.getContentSpacing(0.25),
    paddingLeft: theme.getContentSpacing(0.5),
    paddingRight: theme.getContentSpacing(0.5),
    [theme.breakpoints.up('md')]: {
      paddingTop: theme.getContentSpacing(0.75),
      paddingBottom: theme.getContentSpacing(0.75),
      paddingLeft: theme.getContentSpacing(),
      paddingRight: theme.getContentSpacing(),
    },
  },
  label: {
    fontWeight: 700,
  },
  [TYPES.EMPHASIS]: {
    backgroundColor: theme.palette.emphasis.background,
    border: `1px solid ${getBorderColorStyle(theme.palette.emphasis.background)}`,
  },
  [TYPES.WARNING]: {
    backgroundColor: theme.palette.warning.background,
    border: `1px solid ${getBorderColorStyle(theme.palette.warning.background)}`,
  },
  [TYPES.ALERT]: {
    backgroundColor: theme.palette.alertStrong.background,
    border: `1px solid ${getBorderColorStyle(theme.palette.alertStrong.background)}`,
  },
  [TYPES.NO_RESULTS]: {
    backgroundColor: theme.palette.noResults.background,
    border: `1px solid ${getBorderColorStyle(theme.palette.noResults.background)}`,
    // Note: not mobile-first approach because
    // we have !important overrides
    [theme.breakpoints.down('sm')]: {
      width: 'unset !important',
      position: 'fixed !important',
      left: theme.spacing(2),
      right: theme.spacing(2),
    },
  },
  [TYPES.NEUTRAL]: {},
  icon: {
    display: 'flex',
    alignItems: 'center',
    paddingRight: theme.getContentSpacing(0.5),
  },
}))

const ICONS = {
  [TYPES.EMPHASIS]: <img alt="" src={emphasisIcon} />,
  [TYPES.WARNING]: <img alt="" src={warningIcon} />,
  [TYPES.ALERT]: <img alt="" src={alertIcon} />,
  [TYPES.NO_RESULTS]: <img alt="" src={noResultsIcon} />,
  [TYPES.NEUTRAL]: null,
}

type PropTypes = {
  title?: Node,
  message: Node,
  type: AlertTypeEnum,
  className?: string,
  onClose?: Function,
}

const Alert = ({title, type, message, className, onClose}: PropTypes) => {
  const classes = useAppStyles()
  const {translate: tr} = useI18n()
  const icon = ICONS[type] && (
    <Grid item className={classes.icon}>
      {ICONS[type]}
    </Grid>
  )
  return (
    <Paper elevation={0} className={cn(classes[type], classes.wrapper, className)}>
      <Grid container direction="row" justify="center" alignItems="center">
        {icon}
        <Grid item className="flex-grow-1">
          <Grid
            container
            direction="column"
            justify="space-around"
            className={cn('h-100', 'flex-grow-1')}
          >
            <Grid item>
              <Typography variant="overline" color="inherit" className={classes.label}>
                {/* Compare to null so we can hide title by setting it to empty string */}
                {title == null ? tr(messages[type]) : title}
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant="body2" color="inherit">
                {message}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        {onClose && (
          <CloseIconButton
            onClick={onClose}
            color={type === TYPES.NO_RESULTS ? 'primary' : 'default'}
          />
        )}
      </Grid>
    </Paper>
  )
}

Alert.defaultProps = {
  type: TYPES.NEUTRAL,
}

export default Alert
