// @flow

import React from 'react'
import {Hidden} from '@material-ui/core'

type Props = {|
  children: React$Node,
  implementation?: 'css' | 'js',
  className?: string,
|}

export const MobileOnly = ({children, implementation = 'css', className}: Props) => (
  <Hidden mdUp implementation={implementation} className={className}>
    {children}
  </Hidden>
)

export const DesktopOnly = ({children, implementation = 'css', className}: Props) => (
  <Hidden smDown implementation={implementation} className={className}>
    {children}
  </Hidden>
)
