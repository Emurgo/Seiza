// @flow

import {_getStorage} from './storage'

// TODO: test this and find other way around this
// $FlowFixMe
export default (process.browser
  ? _getStorage(sessionStorage, 'session')
  : // eslint-disable-next-line no-empty-function
  {
    getItem: (...args: Array<any>): any => null,
    setItem: (...args: Array<any>): any => {
      // Do nothing
    },
    removeItem: (...args: Array<any>): any => {
      // Do nothing
    },
  })
