// @flow
import {useState, useCallback} from 'react'

type UseTabStateReturnValue = {
  currentTab: number,
  currentTabName: string,
  setTab: (tabIndex: number) => any,
}

type UseTabState = (
  tabNames: $ReadOnlyArray<string>,
  initialTabIndex?: number
) => UseTabStateReturnValue

const useTabState: UseTabState = (tabNames, initialTabIndex = 0) => {
  const [currentTabIndex, setTabIndex] = useState(0)
  const setTab = useCallback((tabIndex) => setTabIndex(tabIndex), [setTabIndex])
  return {
    currentTab: currentTabIndex,
    currentTabName: tabNames[currentTabIndex],
    setTab,
  }
}

export default useTabState
