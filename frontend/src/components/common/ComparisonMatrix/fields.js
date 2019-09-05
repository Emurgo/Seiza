// @flow

import React from 'react'

import {makeStyles} from '@material-ui/styles'
import {Typography, Tooltip} from '@material-ui/core'
import {fade} from '@material-ui/core/styles/colorManipulator'
import {defineMessages} from 'react-intl'

import {useI18n} from '@/i18n/helpers'
import {CopyToClipboard, Link} from '@/components/common'

import {getBodyBackground, PADDING} from './utils'

const messages = defineMessages({
  copyText: 'Copy',
  fullScreen: 'Full screen mode',
})

const useStyles = makeStyles(({typography}) => ({
  ellipsis: typography._ellipsize,
}))

export const EllipsizedLinkFieldWithTooltip = ({text}: {text: string}) => {
  const classes = useStyles()
  return (
    <Tooltip title={<CustomTooltip text={text} />} placement="top" interactive>
      {/* Note: Without this extra `div` tooltip is not working */}
      <div>
        <Link external bold to={text}>
          <Typography variant="body1" className={classes.ellipsis}>
            {text}
          </Typography>
        </Link>
      </div>
    </Tooltip>
  )
}

const useDescriptionStyles = makeStyles((theme) => {
  return {
    wrapper: {
      position: 'relative',
    },
    overlay: {
      height: '90px',
      width: '100%',
      background: `linear-gradient(to top, ${getBodyBackground(theme)} 0%, ${fade(
        getBodyBackground(theme),
        0.15
      )} 70%)`,
      position: 'absolute',
      bottom: 0,
    },
    text: ({height}) => ({
      overflow: 'hidden',
      height: height - PADDING,
    }),
  }
})

export const FadeoutFieldWithTooltip = ({text, height}: {text: string, height: number}) => {
  const classes = useDescriptionStyles({height})
  // TODO: the tooltip here is not the one from our visual components
  // because it looks messy
  return (
    <Tooltip title={<CustomTooltip text={text} />} placement="top" interactive>
      <div className={classes.wrapper}>
        <Typography className={classes.text} variant="body1">
          {text}
        </Typography>
        <div className={classes.overlay} />
      </div>
    </Tooltip>
  )
}

const useTooltipStyles = makeStyles((theme) => ({
  text: {
    wordBreak: 'break-word',
    color: 'white',
  },
  copy: {
    cursor: 'pointer',
    padding: '10px 0',
    display: 'flex',
    justifyContent: 'center',
  },
}))

export const CustomTooltip = ({text}: {text: string}) => {
  const {translate} = useI18n()
  const classes = useTooltipStyles()
  return (
    <div>
      <Typography className={classes.text}>{text}</Typography>
      <div className={classes.copy}>
        <CopyToClipboard value={text}>{translate(messages.copyText)}</CopyToClipboard>
      </div>
    </div>
  )
}
