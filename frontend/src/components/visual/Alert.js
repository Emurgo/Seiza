// @flow
import React from 'react'
import type {Node} from 'react'
import cn from 'classnames'
import {defineMessages} from 'react-intl'
import {Paper, createStyles, Grid, Typography} from '@material-ui/core'
import {darken} from '@material-ui/core/styles/colorManipulator'
import {makeStyles} from '@material-ui/styles'
import emphasisIcon from '@/assets/icons/emphasis.svg'
import warningIcon from '@/assets/icons/warning.svg'
import alertIcon from '@/assets/icons/alert.svg'
import {useI18n} from '@/i18n/helpers'

const TYPES = Object.freeze({
  EMPHASIS: 'emphasis',
  WARNING: 'warning',
  ALERT: 'alert',
  NEUTRAL: 'neutral',
})
type AlertTypeEnum = $Values<typeof TYPES>

// Note: babel-plugin-react-intl-auto cannot handle member expressions
const messages = defineMessages({
  emphasis: 'Emphasis',
  warning: 'Warning',
  alert: 'Alert',
  neutral: 'Message',
})

const getBorderColorStyle = (backgroundColor) => darken(backgroundColor, 0.05)

const useAppStyles = makeStyles(({type, spacing, palette}) =>
  createStyles({
    wrapper: {
      padding: spacing.unit * 2,
      paddingLeft: spacing.unit * 4,
      paddingRight: spacing.unit * 4,
    },
    [TYPES.EMPHASIS]: {
      backgroundColor: palette.emphasis.background,
      border: `1px solid ${getBorderColorStyle(palette.emphasis.background)}`,
    },
    [TYPES.WARNING]: {
      backgroundColor: palette.warning.background,
      border: `1px solid ${getBorderColorStyle(palette.warning.background)}`,
    },
    [TYPES.ALERT]: {
      backgroundColor: palette.alertStrong.background,
      border: `1px solid ${getBorderColorStyle(palette.alertStrong.background)}`,
    },
    [TYPES.NEUTRAL]: {},
  })
)

const ICONS = {
  [TYPES.EMPHASIS]: <img alt="" src={emphasisIcon} />,
  [TYPES.WARNING]: <img alt="" src={warningIcon} />,
  [TYPES.ALERT]: <img alt="" src={alertIcon} />,
  [TYPES.NEUTRAL]: null,
}

type PropTypes = {
  title?: Node,
  message: Node,
  type: AlertTypeEnum,
  className?: string,
}

const Alert = ({title, type, message, className}: PropTypes) => {
  const classes = useAppStyles()
  const {translate: tr} = useI18n()
  const icon = ICONS[type] && <Grid item>{ICONS[type]}</Grid>
  return (
    <Paper elevation={0} className={cn(classes[type], classes.wrapper, className)}>
      <Grid container direction="row" justify="center" alignItems="center" spacing={16}>
        {icon}
        <Grid item className="flex-grow-1">
          <Grid
            container
            direction="column"
            justify="space-around"
            className={cn('h-100', 'flex-grow-1')}
          >
            <Grid item>
              <Typography variant="overline" color="inherit">
                {title || tr(messages[type])}
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant="body2" color="inherit">
                {message}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  )
}

Alert.defaultProps = {
  type: TYPES.NEUTRAL,
}

export default Alert
