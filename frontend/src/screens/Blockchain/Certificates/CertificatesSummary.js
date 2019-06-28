import React from 'react'
import {defineMessages} from 'react-intl'
import {makeStyles} from '@material-ui/styles'
import _ from 'lodash'

import {CERT_TYPES} from './helpers'
import CertificateIcon from './CertificateIcon'
import {useI18n} from '@/i18n/helpers'

const messages = defineMessages({
  registered: 'Pool registered: {count}',
  deregistered: 'Pool de-registered: {count}',
  retiring: 'Pool retiring: {count}',
})

const certsToMessages = (certificates = [], {translate: tr}) => {
  const certCounts = _.countBy(certificates, 'type')

  const MESSAGES = {
    [CERT_TYPES.KEY_REGISTERED]: messages.registered,
    [CERT_TYPES.KEY_DEREGISTERED]: messages.deregistered,
    [CERT_TYPES.POOL_RETIRING]: messages.retiring,
  }
  return certificates.map((cert) => tr(MESSAGES[cert.type], {count: certCounts[cert.type]}))
}

const certsToIcons = (certificates = []) =>
  certificates.map((cert, index) => <CertificateIcon key={index} type={cert.type} />)

const useStyles = makeStyles(({spacing}) => ({
  wrapper: {
    marginRight: spacing(3),
  },
  label: {
    paddingLeft: spacing(1),
  },
}))

const CertificatesSummary = ({certificates = []}) => {
  const i18n = useI18n()
  const classes = useStyles()
  const certificatesMessages = certsToMessages(certificates, i18n)
  const icons = certsToIcons(certificates)
  return (
    <div>
      {_.zip(icons, certificatesMessages).map(([icon, certMessage], index) => (
        <span key={index} className={classes.wrapper}>
          {icon}
          <span className={classes.label}>{certMessage}</span>
        </span>
      ))}
    </div>
  )
}

export default CertificatesSummary
