// @flow

import React from 'react'
import {Hidden} from '@material-ui/core'

type Props = {|
  children: React$Node,
  implementation?: 'css' | 'js',
|}

export const MobileOnly = ({children, implementation = 'css'}: Props) => (
  <Hidden mdUp implementation={implementation}>
    {children}
  </Hidden>
)

export const DesktopOnly = ({children, implementation = 'css'}: Props) => (
  <Hidden smDown implementation={implementation}>
    {children}
  </Hidden>
)
