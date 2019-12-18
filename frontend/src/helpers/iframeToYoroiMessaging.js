// @flow
import React, {useCallback} from 'react'
import config from '@/config'
import _ from 'lodash'

import {useManageSimpleContextValue} from '../screens/Staking/context/utils'

type SelectedPools = Array<{name: string, poolHash: string}>

export const Source = Object.freeze({
  CHROME_EXTENSION: 'chrome',
  FIREFOX_EXTENSION: 'firefox',
  MOBILE: 'mobile',
})
export type SourceType = $Values<typeof Source>

const relevantDataForYoroi = (selectedPools) => {
  const pools = _.map(selectedPools, _.partialRight(_.pick, ['name', 'poolHash']))
  return encodeURI(JSON.stringify(pools))
}

export const YoroiCallback = (selectedPools: SelectedPools) => {
  const {value: source} = useManageSimpleContextValue(false, 'source', 'Unknown')
  const {value: chromeId} = useManageSimpleContextValue(false, 'chromeId', '')
  const {value: mozId} = useManageSimpleContextValue(false, 'mozId', '')

  return useCallback(() => {
    const encodedDataForYoroi = relevantDataForYoroi(selectedPools)
    switch (source) {
      case Source.CHROME_EXTENSION:
        window.parent.postMessage(
          encodedDataForYoroi,
          `chrome-extension://${chromeId}/main_window.html#/staking`
        )
        break
      case Source.FIREFOX_EXTENSION:
        window.parent.postMessage(
          encodedDataForYoroi,
          `moz-extension://${mozId}/main_window.html#/staking`
        )
        break
      case Source.MOBILE:
        window.parent.postMessage(encodedDataForYoroi, 'yoroi://simple-staking/selection')
        break
      default:
        window.parent.postMessage(encodedDataForYoroi, 'http://localhost:3001')
        throw new Error(`Unknown source: ${source}`)
    }
  }, [chromeId, mozId, selectedPools, source])
}
