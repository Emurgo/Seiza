// @flow
import {useState, useCallback} from 'react'
import localStorage from '@/helpers/localStorage'
export default function<T>(key: string, initialValue: T): [T, (val: T) => void] {
  const [value, setValue] = useState(localStorage.getItem(key) || initialValue)
  const setter = useCallback(
    (newValue: T) => {
      localStorage.setItem(key, newValue)
      setValue(newValue)
    },
    [key, setValue]
  )
  return [value, setter]
}
