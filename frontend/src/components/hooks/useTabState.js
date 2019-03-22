// @flow
import {useState, useCallback} from 'react'

type UseTabStateReturnValue = {
  currentTabIndex: number,
  currentTab: string,
  setTab: (tab: string) => any,
  setTabByEventIndex: (event: any, index: number) => any,
}

type UseTabState = (
  tabNames: $ReadOnlyArray<string>,
  initialTabName?: string
) => UseTabStateReturnValue

// Note: Not compatible with WithTabState
const useTabState: UseTabState = (tabNames, initialTabName) => {
  const [currentTab, setTab] = useState(initialTabName || tabNames[0])
  const setTabByEventIndex = useCallback((event, index) => setTab(tabNames[index]), [tabNames])
  return {
    currentTabIndex: tabNames.indexOf(currentTab),
    currentTab,
    setTab,
    setTabByEventIndex, // material-ui's Tabs's callback
  }
}

export default useTabState
