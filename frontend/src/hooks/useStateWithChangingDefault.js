// @flow

import {useState} from 'react'

export const useStateWithChangingDefault = <T>(defaultValue: T): [T, (value: T) => void] => {
  const [value, setValue] = useState(defaultValue)
  const [currentDefault, setCurrentDefault] = useState(defaultValue)

  if (defaultValue !== currentDefault) {
    setCurrentDefault(defaultValue)
    setValue(defaultValue)
  }

  return [value, setValue]
}
