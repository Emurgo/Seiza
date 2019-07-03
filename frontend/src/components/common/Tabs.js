// @flow
import React, {useContext} from 'react'

type ContextType = {
  currentTabIndex: number,
  currentTab: string,
  setTab: (tab: string) => any,
  setTabByEventIndex: (event: any, index: number) => any,
}

export const Context = React.createContext<ContextType>({})

type TabsProviderProps = {
  currentTabIndex: number,
  currentTab: string,
  setTab: (tab: string) => any,
  setTabByEventIndex: (event: any, index: number) => any,
  children: React$Node,
}

export const TabsProvider = ({
  currentTab,
  currentTabIndex,
  setTab,
  setTabByEventIndex,
  children,
}: TabsProviderProps) => {
  return (
    <Context.Provider value={{currentTab, currentTabIndex, setTab, setTabByEventIndex}}>
      {children}
    </Context.Provider>
  )
}

export const useTabContext = () => {
  return useContext(Context)
}

type TabItemProps = {
  name: string,
  children: React$Node,
}

export const TabItem = ({name, children}: TabItemProps) => {
  const {currentTab} = useTabContext()
  return name === currentTab ? children : null
}
