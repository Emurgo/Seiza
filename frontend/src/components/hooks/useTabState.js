// @flow
import {useState, useCallback} from 'react'

type UseTabStateReturnValue = {
  currentTabIndex: number,
  currentTab: string,
  setTab: (tabIndex: number) => any,
}

type UseTabState = (
  tabNames: $ReadOnlyArray<string>,
  initialTabName?: string
) => UseTabStateReturnValue

const tabNameToIndex = (tabNames, tabName) => {
  const indexOfTab = tabNames.indexOf(tabName)
  return indexOfTab === -1 ? 0 : indexOfTab
}

// Note: Not compatible with WithTabState
const useTabState: UseTabState = (tabNames, initialTabName) => {
  const initialTabIndex = tabNameToIndex(tabNames, initialTabName)
  const [currentTabIndex, setTabIndex] = useState(initialTabIndex)
  const setTab = useCallback((tabName) => setTabIndex(tabNameToIndex(tabNames, tabName)), [
    tabNames,
    setTabIndex,
  ])
  return {
    currentTabIndex,
    currentTab: tabNames[currentTabIndex],
    setTab,
  }
}

export default useTabState
