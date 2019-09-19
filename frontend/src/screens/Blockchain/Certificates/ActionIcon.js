// @flow
import React from 'react'
import {makeStyles} from '@material-ui/styles'

import {CERT_ACTIONS_TYPES} from './actionTypes'
import type {CertificateType} from './actionTypes'

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
      <img
        className={classes.img}
        alt=""
        src="/static/assets/icons/certificateActions/action-key-registered.svg"
      />
    ),
    [CERT_ACTIONS_TYPES.KEY_DEREGISTRATION]: (
      <img
        className={classes.img}
        alt=""
        src="/static/assets/icons/certificateActions/action-key-deregistered.svg"
      />
    ),
    [CERT_ACTIONS_TYPES.KEY_REWARD_RECEIPT]: '<Icon>', // TODO: add icon
    [CERT_ACTIONS_TYPES.KEY_REGISTRATION_AS_POOL_OWNER]: '<Icon>', // TODO: add icon
    [CERT_ACTIONS_TYPES.KEY_DEREGISTRATION_AS_POOL_OWNER]: '<Icon>', // TODO: add icon
    [CERT_ACTIONS_TYPES.KEY_REGISTRATION_AS_POOL_REWARD_TARGET]: '<Icon>', // TODO: add icon
    [CERT_ACTIONS_TYPES.KEY_DEREGISTRATION_AS_POOL_REWARD_TARGET]: '<Icon>', // TODO: add icon
    [CERT_ACTIONS_TYPES.KEY_DELEGATION]: (
      <img
        className={classes.img}
        alt=""
        src="/static/assets/icons/certificateActions/action-delegation.svg"
      />
    ),
    [CERT_ACTIONS_TYPES.POOL_CREATION]: (
      <img
        className={classes.img}
        alt=""
        src="/static/assets/icons/certificateActions/action-pool-created.svg"
      />
    ),
    [CERT_ACTIONS_TYPES.POOL_UPDATE]: (
      <img
        className={classes.img}
        alt=""
        src="/static/assets/icons/certificateActions/action-pool-updated.svg"
      />
    ),
    [CERT_ACTIONS_TYPES.POOL_DELETION]: (
      <img
        className={classes.img}
        alt=""
        src="/static/assets/icons/certificateActions/action-pool-removed.svg"
      />
    ),
    [CERT_ACTIONS_TYPES.POOL_RETIREMENT]: (
      <img
        className={classes.img}
        alt=""
        src="/static/assets/icons/certificateActions/action-pool-retiring.svg"
      />
    ),
    [CERT_ACTIONS_TYPES.POOL_RETIREMENT_CANCELLATION]: (
      <img
        className={classes.img}
        alt=""
        src="/static/assets/icons/certificateActions/action-pool-retirement-canceled.svg"
      />
    ),
  }
  return TO_ICON[type]
}

export default ActionIcon
