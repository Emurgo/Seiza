// @flow
import React from 'react'
import {defineMessages, FormattedHTMLMessage} from 'react-intl'
import {Divider} from '@material-ui/core'

import {EntityCardContent, Card, ContentSpacing} from '@/components/visual'
import {ReactComponent as CertificateIcon} from '@/static/assets/icons/reward-address.svg'
import {useI18n} from '@/i18n/helpers'
import CertificateList from '@/screens/Blockchain/Certificates/CertificateList'

const messages = defineMessages({
  certificatesLabel: 'Certificates',
  certificatesValue:
    '{count, plural, =0 {<b>#</b> Certificates} one {<b>#</b> Certificate} other {<b>#</b> Certificates}}',
})

type Props = {|
  certificates: Array<any>,
|}

const Certificates = ({certificates}: Props) => {
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
                count: certificates.length,
              }}
            />
          }
          iconRenderer={<CertificateIcon />}
          ellipsizeValue={false}
          monospaceValue={false}
          showCopyIcon={false}
        />
      </ContentSpacing>
      <Divider />
      <CertificateList certificates={certificates} />
    </Card>
  )
}

export default Certificates
