// @flow
import React from 'react'
import {makeStyles} from '@material-ui/styles'

import {CERT_ACTIONS_TYPES} from './actionTypes'
import type {CertificateType} from './actionTypes'

import keyDeregisteredIcon from '@/static/assets/icons/certificateActions/action-key-deregistered.svg'
import keyRegisteredIcon from '@/static/assets/icons/certificateActions/action-key-registered.svg'
import poolRetiringIcon from '@/static/assets/icons/certificateActions/action-pool-retiring.svg'
import poolCreatedIcon from '@/static/assets/icons/certificateActions/action-pool-created.svg'
import delegationIcon from '@/static/assets/icons/certificateActions/action-delegation.svg'
import poolUpdatedIcon from '@/static/assets/icons/certificateActions/action-pool-updated.svg'
import poolRemovedIcon from '@/static/assets/icons/certificateActions/action-pool-removed.svg'

const useStyles = makeStyles(() => ({
  img: {
    verticalAlign: 'middle',
  },
}))

type Props = {
  type: CertificateType,
}

// Note(bigamasta): not sure if we should have icons only
// for Certificates (abstract) or Certificate Actions
const ActionIcon = ({type}: Props) => {
  const classes = useStyles()
  const TO_ICON = {
    [CERT_ACTIONS_TYPES.KEY_REGISTRATION]: (
      <img className={classes.img} alt="" src={keyRegisteredIcon} />
    ),
    [CERT_ACTIONS_TYPES.KEY_DEREGISTRATION]: (
      <img className={classes.img} alt="" src={keyDeregisteredIcon} />
    ),
    [CERT_ACTIONS_TYPES.KEY_REWARD_RECEIPT]: '<Icon>', // TODO: add icon
    [CERT_ACTIONS_TYPES.KEY_REGISTRATION_AS_POOL_OWNER]: '<Icon>', // TODO: add icon
    [CERT_ACTIONS_TYPES.KEY_DEREGISTRATION_AS_POOL_OWNER]: '<Icon>', // TODO: add icon
    [CERT_ACTIONS_TYPES.KEY_REGISTRATION_AS_POOL_REWARD_TARGET]: '<Icon>', // TODO: add icon
    [CERT_ACTIONS_TYPES.KEY_DEREGISTRATION_AS_POOL_REWARD_TARGET]: '<Icon>', // TODO: add icon
    [CERT_ACTIONS_TYPES.KEY_DELEGATION]: (
      <img className={classes.img} alt="" src={delegationIcon} />
    ),
    [CERT_ACTIONS_TYPES.POOL_CREATION]: (
      <img className={classes.img} alt="" src={poolCreatedIcon} />
    ),
    [CERT_ACTIONS_TYPES.POOL_UPDATE]: <img className={classes.img} alt="" src={poolUpdatedIcon} />,
    [CERT_ACTIONS_TYPES.POOL_DELETION]: (
      <img className={classes.img} alt="" src={poolRemovedIcon} />
    ),
    [CERT_ACTIONS_TYPES.POOL_RETIREMENT]: (
      <img className={classes.img} alt="" src={poolRetiringIcon} />
    ),
    [CERT_ACTIONS_TYPES.POOL_RETIREMENT_CANCELLATION]: '<Icon>', // TODO: add icon
  }
  return TO_ICON[type]
}

export default ActionIcon
