// @flow
import React, {useCallback} from 'react'

const relevantDataForYoroi = (selectedPools) => {
  const pools = _.map(selectedPools, _.partialRight(_.pick, ['name', 'poolHash']))
  return encodeURI(JSON.stringify(pools))
}

type SelectedPools = Array<{name: string, poolHash: string}>

export const YoroiCallback = (selectedPools: SelectedPools) => {
  return useCallback(() => {
    // window.parent.postMessage(
    //     relevantDataForYoroi(selectedPools),
    //     `chrome-extension://${config.yoroiChromeExtensionHash}/main_window.html#/staking`
    // )
    // window.parent.postMessage(
    //     relevantDataForYoroi(selectedPools),
    //     `moz-extension://${config.yoroiFirefoxExtensionHash}/main_window.html#/staking`
    // )
    // window.ReactNativeWebView.postMessage
    window.parent.postMessage(
      relevantDataForYoroi(selectedPools),
      'yoroi://simple-staking/selection'
    )
  }, [selectedPools])
}
