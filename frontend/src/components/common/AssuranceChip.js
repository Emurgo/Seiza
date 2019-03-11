// @flow

import React from 'react'
import type {ComponentType} from 'react'
import {withStyles, createStyles, Chip} from '@material-ui/core'
import {defineMessages} from 'react-intl'
import {compose} from 'redux'

import {withI18n} from '@/i18n/helpers'

import classNames from 'classnames'

export type AssuranceLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'xx'

const assuranceMessages = defineMessages({
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
})

// TODO: use colors from scheme
const assuranceLevelStyles = (theme) =>
  createStyles({
    LOW: {
      color: 'white',
      backgroundColor: '#FF3860',
    },
    MEDIUM: {
      color: 'black',
      backgroundColor: '#FFDD57',
    },
    HIGH: {
      color: 'white',
      backgroundColor: '#87E6D4',
    },
    uppercase: {
      textTransform: 'uppercase',
    },
  })

type ExternalProps = {|
  level: AssuranceLevel,
|}

const AssuranceChip: ComponentType<ExternalProps> = compose(
  withStyles(assuranceLevelStyles),
  withI18n
)(({classes, level, i18n}) => {
  const text = i18n.translate(assuranceMessages[level])
  const className = classes[level]
  return <Chip label={text} className={classNames(className, classes.uppercase)} />
})

export default AssuranceChip
