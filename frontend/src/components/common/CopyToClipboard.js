import React from 'react'
import {Tooltip, IconButton} from '@material-ui/core'
import {defineMessages} from 'react-intl'

import {withI18n} from '@/i18n/helpers'
import WithCopyToClipboard from '../headless/copyToClipboard'

import copyIcon from '@/assets/icons/copy.svg'
import copiedIcon from '@/assets/icons/copied.svg'

const messages = defineMessages({
  altText: 'Copy to clipboard',
  tooltipCopy: 'Copy to clipboard',
  tooltipCopied: 'Copied!',
})

const _CopyToClipboard = ({value, i18n, children = null}) => {
  const {translate} = i18n
  return (
    <WithCopyToClipboard value={value}>
      {({copy, isCopied, reset}) => (
        <React.Fragment>
          <Tooltip
            title={isCopied ? translate(messages.tooltipCopied) : translate(messages.tooltipCopy)}
            TransitionProps={{
              onExited: reset,
            }}
          >
            {children ? (
              <div onClick={copy}>{children}</div>
            ) : (
              <IconButton onClick={copy}>
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
