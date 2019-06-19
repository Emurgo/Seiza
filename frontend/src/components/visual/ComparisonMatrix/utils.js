// @flow

import {darken} from '@material-ui/core/styles/colorManipulator'

// TODO: we could type theme

export const getHeaderBackground = (theme: any) => darken(theme.palette.background.default, 0.04)

export const getBodyBackground = (theme: any) => theme.palette.background.paper

// TODO: make something better than PADDING
export const PADDING = 16

export const ellipsizeStyles = {
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
}
