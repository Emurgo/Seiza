// @flow

import React from 'react'
import cn from 'classnames'
import {makeStyles} from '@material-ui/styles'
import {defineMessages} from 'react-intl'

import {Chip} from '@/components/visual'
import {useI18n} from '@/i18n/helpers'

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
    backgroundColor: '#F8D8E6',
  },
  MEDIUM: {
    color: 'white',
    backgroundColor: '#F07C5C',
  },
  HIGH: {
    color: 'white',
    backgroundColor: '#87E6D4',
  },
  PENDING: {
    color: 'white',
    backgroundColor: '#ABABAB',
  },
  FAILED: {
    color: 'white',
    backgroundColor: '#ED5354',
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
  return <Chip rounded label={text} className={cn(className, classes.uppercase)} />
}

export default AssuranceChip
