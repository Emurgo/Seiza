// @flow
import React from 'react'
import cn from 'classnames'
import {Typography} from '@material-ui/core'
import {makeStyles} from '@material-ui/styles'

import {useIsMobile} from '@/components/hooks/useBreakpoints'
import {VisualHash} from '@/components/visual'
import {Link, CopyToClipboard} from '@/components/common'
import {routeTo} from '@/helpers/routes'

type Props = {
  name: string,
  hash: string,
}

const useStyles = makeStyles(({palette, spacing, breakpoints}) => ({
  visualHashWrapper: {
    marginTop: '7px',
  },
  info: {
    paddingLeft: spacing(1),
    paddingRight: spacing(3),
  },
  flexEllipsize: {
    // needed for proper ellipsize in children components with flex
    minWidth: 0,
  },
  hashWrapper: {
    display: 'flex',
    alignItems: 'center',
  },
}))

const COPY_DIMENSIONS = {width: 20, height: 20}

// Note: not using `EntityCardContent` as it would need to be customized to
// ellipsize pool name (that component is already complicated enough) and
// also PoolEntityContent is specific enough
const PoolEntityContent = ({name, hash}: Props) => {
  const isMobile = useIsMobile()
  const classes = useStyles()
  return (
    <div className={cn(classes.flexEllipsize, 'd-flex')}>
      <div className={classes.visualHashWrapper}>
        <VisualHash value={hash} size={isMobile ? 36 : 48} />
      </div>
      <div className={cn(classes.info, classes.flexEllipsize, 'flex-grow-1')}>
        <Typography noWrap variant="h6">
          {name}
        </Typography>
        <div className={classes.hashWrapper}>
          <Typography noWrap>
            <Link monospace to={routeTo.stakepool(hash)}>
              {hash}
            </Link>
          </Typography>
          <CopyToClipboard value={hash} imgDimensions={COPY_DIMENSIONS} outlineSize={4} />
        </div>
      </div>
    </div>
  )
}

export default PoolEntityContent
