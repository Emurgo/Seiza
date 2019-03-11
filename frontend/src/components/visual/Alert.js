// @flow
import React from 'react'
import type {Node} from 'react'
import classnames from 'classnames'
import {defineMessages} from 'react-intl'
import {Paper, createStyles, Grid, Typography} from '@material-ui/core'
import {darken} from '@material-ui/core/styles/colorManipulator'
import {makeStyles} from '@material-ui/styles'
import emphasisIcon from '@/assets/icons/emphasis.svg'
import warningIcon from '@/assets/icons/warning.svg'
import alertIcon from '@/assets/icons/alert.svg'
import {useI18n} from '@/i18n/helpers'

const TYPES = {
  EMPHASIS: 'emphasis',
  WARNING: 'warning',
  ALERT: 'alert',
  NEUTRAL: 'neutral',
}
type AlertTypeEnum = $Values<typeof TYPES>

const I18N_PREFIX = 'alert'

const messages = defineMessages({
  [TYPES.EMPHASIS]: {
    id: `${I18N_PREFIX}.emphasis`,
    defaultMessage: 'Emphasis',
  },
  [TYPES.WARNING]: {
    id: `${I18N_PREFIX}.warning`,
    defaultMessage: 'Warning',
  },
  [TYPES.ALERT]: {
    id: `${I18N_PREFIX}.alert`,
    defaultMessage: 'Alert',
  },
  [TYPES.NEUTRAL]: {
    id: `${I18N_PREFIX}.neutral`,
    defaultMessage: 'Message',
  },
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
}

const Alert = ({title, type, message}: PropTypes) => {
  const classes = useAppStyles()
  const {translate: tr} = useI18n()
  const icon = ICONS[type] && <Grid item>{ICONS[type]}</Grid>
  return (
    <Paper elevation={0} className={classnames(classes[type], classes.wrapper)}>
      <Grid container direction="row" justify="center" alignItems="center" spacing={16}>
        {icon}
        <Grid item className="flex-grow-1">
          <Grid
            container
            direction="column"
            justify="space-around"
            className={classnames('h-100', 'flex-grow-1')}
          >
            <Grid item>
              <Typography variant="overline">{title || tr(messages[type])}</Typography>
            </Grid>
            <Grid item>
              <Typography variant="body2">
                <span className={classes.message}>{message}</span>
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
