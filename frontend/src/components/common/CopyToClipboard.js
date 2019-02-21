import React from 'react'
import {Tooltip, IconButton} from '@material-ui/core'
import {defineMessages} from 'react-intl'

import {withI18n} from '@/i18n/helpers'
import WithCopyToClipboard from '../headless/copyToClipboard'

import copyIcon from '@/tmp_assets/copy-icon.png'

const I18N_PREFIX = 'ui_elements.copy_to_clipboard'

const messages = defineMessages({
  altText: {
    id: `${I18N_PREFIX}.altText`,
    defaultMessage: 'Copy to clipboard',
  },
  tooltipCopy: {
    id: `${I18N_PREFIX}.tooltipCopy`,
    defaultMessage: 'Copy to clipboard',
  },
  tooltipCopied: {
    id: `${I18N_PREFIX}.tooltipCopied`,
    defaultMessage: 'Copied!',
  },
})

const _CopyToClipboard = ({value, i18n}) => {
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
            <IconButton onClick={copy}>
              <img alt={messages.altText} src={copyIcon} />
            </IconButton>
          </Tooltip>
        </React.Fragment>
      )}
    </WithCopyToClipboard>
  )
}

export default withI18n(_CopyToClipboard)
