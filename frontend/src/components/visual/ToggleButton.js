// @flow
import * as React from 'react'

import {ArrowDropDown, ArrowRight} from '@material-ui/icons'

import Button from './Button'

type Props = {
  open: boolean,
  children: React.Node,
}

export default ({open, children, ...restProps}: Props) => {
  return (
    <Button {...restProps}>
      {children}
      {open ? <ArrowRight /> : <ArrowDropDown />}
    </Button>
  )
}
