// @flow

import {makeStyles} from '@material-ui/styles'

export const useGlobalStyles: any = makeStyles({
  '@global': {
    'html, body, #__next': {
      height: '100%',
    },

    'body': {
      'margin': 0,
      'padding': 0,
      'fontFamily':
        '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
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
  },
})
