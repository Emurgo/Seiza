// @flow
import React from 'react'
import {defineMessages, FormattedHTMLMessage} from 'react-intl'
import {Divider} from '@material-ui/core'

import {Card, ContentSpacing} from '@/components/visual'
import {EntityCardContent} from '@/components/common'
import {ReactComponent as CertificateActionIcon} from '@/static/assets/icons/reward-address.svg'
import {useI18n} from '@/i18n/helpers'
import CertificateActionList from '@/screens/Blockchain/Certificates/ActionList'

const messages = defineMessages({
  certificatesLabel: 'Certificates',
  certificatesValue:
    '{count, plural, =0 {<b>#</b> Certificates} one {<b>#</b> Certificate} other {<b>#</b> Certificates}}',
})

type Props = {|
  certificateActions: Array<any>,
|}

const CertificateActions = ({certificateActions}: Props) => {
  const {translate: tr} = useI18n()
  return (
    <Card>
      <ContentSpacing bottom={0.75} top={0.75}>
        <EntityCardContent
          label={tr(messages.certificatesLabel)}
          value={
            <FormattedHTMLMessage
              // $FlowFixMe
              id={messages.certificatesValue.id}
              values={{
                count: certificateActions.length,
              }}
            />
          }
          iconRenderer={<CertificateActionIcon />}
          ellipsizeValue={false}
          monospaceValue={false}
          showCopyIcon={false}
        />
      </ContentSpacing>
      <Divider />
      <CertificateActionList actions={certificateActions} />
    </Card>
  )
}

export default CertificateActions
