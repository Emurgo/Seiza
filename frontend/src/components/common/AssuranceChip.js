// @flow

import React from 'react'
import {Chip as MuiChip} from '@material-ui/core'
import {makeStyles} from '@material-ui/styles'
import {defineMessages} from 'react-intl'

import {useI18n} from '@/i18n/helpers'

import classNames from 'classnames'

export type ChipType = 'LOW' | 'MEDIUM' | 'HIGH'

const messages = defineMessages({
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
})

// TODO: use colors from scheme
const useStyles = makeStyles((theme) => ({
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
}))

type Props = {|
  level: ChipType,
|}

const AssuranceChip = ({level}: Props) => {
  const classes = useStyles()
  const {translate: tr} = useI18n()

  const text = tr(messages[level])
  const className = classes[level]
  return <MuiChip label={text} className={classNames(className, classes.uppercase)} />
}

export default AssuranceChip
