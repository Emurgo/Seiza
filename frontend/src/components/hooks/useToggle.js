// @flow
import {useState, useCallback} from 'react'

const useToggle = (defaultValue: boolean = false) => {
  const [state, setState] = useState(defaultValue)
  const toggle = useCallback(() => setState((state) => !state), [setState])
  return [state, toggle]
}

export default useToggle
