// @flow

import * as React from 'react'

import {useUrlManager} from '@/hooks/useUrlManager'

export const useManageQueryValue = (
  queryKey: string,
  defaultValue: any,
  transformValue: Function = (v) => v
) => {
  const {setQueryParam, getQueryParam} = useUrlManager()

  const queryValue = transformValue(getQueryParam(queryKey) || defaultValue)

  const setQueryValue = React.useCallback((value: any) => setQueryParam(queryKey, value), [
    setQueryParam,
    queryKey,
  ])

  return [queryValue, setQueryValue]
}
