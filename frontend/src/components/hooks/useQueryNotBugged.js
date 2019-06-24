// @flow
import {useEffect, useState} from 'react'
import {useQuery} from 'react-apollo-hooks'

// https://github.com/trojanowski/react-apollo-hooks/issues/117
// Note: this will hopefully go away in the next version of react-apollo-hooks
export const useQueryNotBugged = (...args: any) => {
  const [notNullData, setNotNullData] = useState({})
  const {data, error, loading, ...rest} = useQuery(...args)

  useEffect(() => {
    if (data && !loading) {
      setNotNullData(data)
    }
  }, [data, loading])

  // Note(ppershing): above useEffect runs only on client
  // for server we should return data if we have
  return {data: data && !loading ? data : notNullData, error, loading, ...rest}
}

// Leaving previous version, so we can use do quick fix without testing
// other parts of app, and unify those hooks later
export const useQueryNotBuggedForBlocks = (...args: any) => {
  const [notNullData, setNotNullData] = useState({})
  const {data, error, loading, ...rest} = useQuery(...args)

  useEffect(() => {
    if (data && !loading) {
      setNotNullData(data)
    }
  }, [data, loading])

  return {data: loading ? notNullData : data || notNullData, error, loading, ...rest}
}
