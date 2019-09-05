// @flow
import React from 'react'
import {makeStyles} from '@material-ui/styles'
import {defineMessages} from 'react-intl'
import {Button} from '@/components/visual'
import {useI18n} from '@/i18n/helpers'

const useStyles = makeStyles((theme) => ({
  panel: {
    position: 'relative',
    flexGrow: 1,
    margin: '20px 30px',
    [theme.breakpoints.up('md')]: {
      marginLeft: 60,
      marginRight: 40,
    },
  },
}))

const messages = defineMessages({
  delegate: 'Delegate',
})

type ExternalProps = {|
  +onClick: Function,
  +disabled: boolean,
|}

const DelegateButton = ({onClick, disabled}: ExternalProps) => {
  const classes = useStyles()
  const {translate: tr} = useI18n()
  return (
    <Button disabled={disabled} variant="contained" className={classes.panel} onClick={onClick}>
      {tr(messages.delegate)}
    </Button>
  )
}

export default DelegateButton
