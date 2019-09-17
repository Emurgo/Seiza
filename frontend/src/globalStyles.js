// @flow

import {makeStyles} from '@material-ui/styles'

export const useGlobalStyles: any = makeStyles({
  '@global': {
    'html': {
      // https://stackoverflow.com/questions/2710764/preserve-html-font-size-when-iphone-orientation-changes-from-portrait-to-landsca
      '-webkit-text-size-adjust': '100%',
    },
    'html, body, #__next': {
      height: '100%',
    },

    'body': {
      'margin': 0,
      'padding': 0,
      'fontFamily': '"Roboto", "Roboto Self", "Arial", "Helvetica Neue"',
      '-webkit-font-smoothing': 'antialiased',
      '-moz-osx-font-smoothing': 'grayscale',
    },

    '*': {
      '-webkit-overflow-scrolling': 'touch',
    },

    '.flex-grow-1': {
      'flex-grow': 1,
    },
    '.d-flex': {
      display: 'flex',
    },
    '.h-100': {
      height: '100%',
    },
    '.w-100': {
      width: '100%',
    },
    '.w-auto': {
      width: 'auto',
    },
  },
})
