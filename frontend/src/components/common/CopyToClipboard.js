import React from 'react'
import {IconButton} from '@material-ui/core'
import {defineMessages} from 'react-intl'

import {withI18n} from '@/i18n/helpers'
import WithCopyToClipboard from '../headless/copyToClipboard'
import {Tooltip} from '@/components/visual'

import copyIcon from '@/assets/icons/copy.svg'
import copiedIcon from '@/assets/icons/copied.svg'
import {makeStyles} from '@material-ui/styles'

const messages = defineMessages({
  altText: 'Copy to clipboard',
  tooltipCopy: 'Copy to clipboard',
  tooltipCopied: 'Copied!',
})

const useTooltipStyles = makeStyles(() => ({
  popper: {
    top: '-10px !important',
  },
}))

const _CopyToClipboard = ({value, i18n, children = null}) => {
  const {translate} = i18n
  const tooltipClasses = useTooltipStyles()
  return (
    <WithCopyToClipboard value={value}>
      {({copy, isCopied, reset}) => (
        <React.Fragment>
          <Tooltip
            title={isCopied ? translate(messages.tooltipCopied) : translate(messages.tooltipCopy)}
            TransitionProps={{
              onExited: reset,
            }}
            classes={tooltipClasses}
          >
            {children ? (
              <div onClick={copy}>{children}</div>
            ) : (
              <IconButton onClick={copy} color="primary">
                <img alt={messages.altText} src={isCopied ? copiedIcon : copyIcon} />
              </IconButton>
            )}
          </Tooltip>
        </React.Fragment>
      )}
    </WithCopyToClipboard>
  )
}

export default withI18n(_CopyToClipboard)
