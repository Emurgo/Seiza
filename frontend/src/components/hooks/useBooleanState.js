// @flow
import {useState, useCallback} from 'react'

const useBooleanState = (defaultValue: boolean = false) => {
  const [state, setState] = useState(defaultValue)
  const setTrue = useCallback(() => setState(true), [setState])
  const setFalse = useCallback(() => setState(false), [setState])
  return [state, setTrue, setFalse]
}

export default useBooleanState
