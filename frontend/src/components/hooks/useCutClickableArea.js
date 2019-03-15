// @flow
import {useCallback} from 'react'
import type {ElementRef} from 'react'

type CutClickableFunction = (
  refToCut: {current: null | ElementRef<any>},
  callback: Function
) => Function

const useCutClickableArea: CutClickableFunction = (refToCut = {current: {}}, callback) =>
  useCallback(
    (event) => {
      refToCut.current && !refToCut.current.contains(event.target) && callback && callback(event)
    },
    [callback, refToCut]
  )

export default useCutClickableArea
