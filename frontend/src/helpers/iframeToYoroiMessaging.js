// @flow
import React, {useCallback} from 'react'
import config from '@/config'
import _ from 'lodash'

import {useManageSimpleContextValue} from '../screens/Staking/context/utils'

type SelectedPools = Array<{name: string, poolHash: string}>

export const Source = Object.freeze({
  CHROME_EXTENSION: 'chrome-extension',
  FIREFOX_EXTENSION: 'moz-extension',
  MOBILE: 'mobile',
})
export type SourceType = $Values<typeof Source>

const relevantDataForYoroi = (selectedPools) => {
  const pools = _.map(selectedPools, _.partialRight(_.pick, ['name', 'poolHash']))
  return encodeURI(JSON.stringify(pools))
}

export const YoroiCallback = (selectedPools: SelectedPools) => {
  const {value: source} = useManageSimpleContextValue(false, 'source', Source.CHROME_EXTENSION)

  return useCallback(() => {
    const encodedDataForYoroi = relevantDataForYoroi(selectedPools)
    switch (source) {
      case Source.CHROME_EXTENSION:
        window.parent.postMessage(
          encodedDataForYoroi,
          `chrome-extension://${config.yoroiChromeExtensionHash}/main_window.html#/staking`
        )
        break
      case Source.FIREFOX_EXTENSION:
        window.parent.postMessage(
          encodedDataForYoroi,
          `moz-extension://${config.yoroiFirefoxExtensionHash}/main_window.html#/staking`
        )
        break
      case Source.MOBILE:
        // TODO : test if this works on mobile
        if (window.ReactNativeWebView) {
          window.ReactNativeWebView.postMessage(
            encodedDataForYoroi,
            'yoroi://simple-staking/selection'
          )
        } else {
          window.parent.postMessage(
            encodedDataForYoroi,
            'yoroi://simple-staking/selection'
          )
        }
        break
      default:
        throw new Error(`Unknown source: ${source}`)
    }
  }, [selectedPools, source])
}
