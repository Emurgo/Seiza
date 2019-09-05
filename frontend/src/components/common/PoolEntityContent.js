// @flow
import React from 'react'
import cn from 'classnames'
import {Typography} from '@material-ui/core'
import {makeStyles} from '@material-ui/styles'

import {VisualHash, ExternalLink, Tooltip} from '@/components/visual'
import {Link, CopyToClipboard, NavTypography} from '@/components/common'
import {routeTo, getExternalSeizaUrl} from '@/helpers/routes'
import config from '@/config'

type Props = {
  name: string,
  hash: string,
  hashTooltip: React$Node,
}

const useStyles = makeStyles(({spacing, typography}) => ({
  info: {
    paddingLeft: spacing(1),
    paddingRight: spacing(3),
    alignItems: 'center',
  },
  flexEllipsize: {
    // needed for proper ellipsize in children components with flex
    minWidth: 0,
  },
  hashWrapper: {
    display: 'flex',
    alignItems: 'center',
  },
  ellipsize: typography._ellipsize,
  name: {
    display: 'inline!important',
  },
}))

const COPY_TO_CLIPBOARD_DIMENSIONS = {width: 20, height: 20}

const HashLink = ({children, hash}) => {
  if (config.isYoroi) {
    return (
      <ExternalLink monospace target="_blank" to={getExternalSeizaUrl(routeTo.stakepool(hash))}>
        {children}
      </ExternalLink>
    )
  } else {
    return (
      <Link monospace target="_self" to={routeTo.stakepool(hash)}>
        {children}
      </Link>
    )
  }
}

const EllipsizedHash = ({hash, hashTooltip}) => {
  return (
    <Tooltip
      title={hashTooltip}
      placement="bottom"
      disableHoverListener={!hashTooltip}
      disableTouchListener={!hashTooltip}
    >
      <Typography noWrap>
        <HashLink hash={hash}>{hash}</HashLink>
      </Typography>
    </Tooltip>
  )
}

// Note: not using `EntityCardContent` as it would need to be customized to
// ellipsize pool name (that component is already complicated enough) and
// also PoolEntityContent is specific enough
const PoolEntityContent = ({name, hash, hashTooltip}: Props) => {
  const classes = useStyles()

  return (
    <div className={cn(classes.flexEllipsize, 'd-flex')}>
      <VisualHash value={hash} size={48} />
      <div className={cn(classes.info, classes.flexEllipsize, 'flex-grow-1')}>
        <div className={cn(classes.ellipsize, classes.flexEllipsize)}>
          <NavTypography className={classes.name}>{name}</NavTypography>
        </div>
        <div className={classes.hashWrapper}>
          <EllipsizedHash hash={hash} hashTooltip={hashTooltip} />

          <CopyToClipboard value={hash} dimensions={COPY_TO_CLIPBOARD_DIMENSIONS} outlineSize={4} />
        </div>
      </div>
    </div>
  )
}

export default PoolEntityContent
