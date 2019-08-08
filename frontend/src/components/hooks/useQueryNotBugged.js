// @flow
import {useEffect, useState} from 'react'
import {useQuery} from 'react-apollo-hooks'

// https://github.com/trojanowski/react-apollo-hooks/issues/117
// Note: this will hopefully go away in the next version of react-apollo-hooks
export const useQueryNotBugged = (...args: any) => {
  const [cachedData, setCachedData] = useState({})
  const {data, error, loading, ...rest} = useQuery(...args)

  useEffect(() => {
    if (!loading) {
      setCachedData(data)
    }
  }, [data, loading])

  return {data: loading ? cachedData : data, error, loading, ...rest}
}
