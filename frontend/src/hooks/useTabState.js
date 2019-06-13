// @flow
import {useState, useCallback, useEffect} from 'react'

// TODO: rethink how to properly handle tab values in url

type UseTabStateReturnValue = {
  currentTabIndex: number,
  setTabByEventIndex: (event: any, index: number) => any,
  currentTab: string,
  setTab: (tab: string) => any,
}

type UseTabState = (
  tabNames: $ReadOnlyArray<string>,
  initialTabName?: ?string,
  currentTab?: string,
  setTab?: (tab: string) => any
) => UseTabStateReturnValue

// Note: Not compatible with WithTabState
const useTabState: UseTabState = (tabNames, initialTabName, outerCurrentTab, outerSetTab) => {
  const [innerCurrentTab, innerSetTab] = useState(initialTabName || tabNames[0])

  const currentTab = outerCurrentTab || innerCurrentTab
  const setTab = outerSetTab || innerSetTab

  const setTabByEventIndex = useCallback((event, index) => setTab(tabNames[index]), [
    setTab,
    tabNames,
  ])

  const invalidInput = tabNames.indexOf(currentTab) === -1

  useEffect(() => {
    invalidInput && setTab(tabNames[0])
    // We want this to run only once, when there might be invalid input from url
    // eslint-disable-next-line
  }, [])

  return {
    currentTabIndex: invalidInput ? 0 : tabNames.indexOf(currentTab),
    setTabByEventIndex, // material-ui's Tabs's callback
    setTab,
    currentTab: invalidInput ? tabNames[0] : currentTab,
  }
}

export default useTabState
