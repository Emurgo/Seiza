// @flow
import React from 'react'
import {makeStyles} from '@material-ui/styles'

import {CERT_TYPES} from './helpers'
import type {CertificateType} from './helpers'

import keyDeregisteredIcon from '@/static/assets/icons/action-key-deregistered.svg'
import keyRegisteredIcon from '@/static/assets/icons/action-key-registered.svg'
import poolRetiringIcon from '@/static/assets/icons/action-pool-retiring.svg'

const useStyles = makeStyles(() => ({
  img: {
    verticalAlign: 'middle',
  },
}))

type Props = {
  type: CertificateType,
}

const CertificateIcon = ({type}: Props) => {
  const classes = useStyles()
  const TO_ICON = {
    [CERT_TYPES.KEY_REGISTERED]: <img className={classes.img} alt="" src={keyRegisteredIcon} />,
    [CERT_TYPES.KEY_DEREGISTERED]: <img className={classes.img} alt="" src={keyDeregisteredIcon} />,
    [CERT_TYPES.POOL_RETIRING]: <img className={classes.img} alt="" src={poolRetiringIcon} />,
  }
  return TO_ICON[type]
}

export default CertificateIcon
