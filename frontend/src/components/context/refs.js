// @flow
import React, {useContext} from 'react'

import {useCallbackRef} from '@/components/hooks/useCallbackRef'

type MobileStakingSettingsContextType = any

const MobileStakingSettingsContext = React.createContext<MobileStakingSettingsContextType>({})

type Props = {|
  children: React$Node,
|}

const MobileStakingSettingsRefProvider = ({children}: Props) => {
  const {htmlNode, callbackRef} = useCallbackRef()
  return (
    <MobileStakingSettingsContext.Provider value={{htmlNode, callbackRef}}>
      {children}
    </MobileStakingSettingsContext.Provider>
  )
}

export const useMobileStakingSettingsRef = () => useContext(MobileStakingSettingsContext)

type TopBarRefContextType = any

const TopBarRefContext = React.createContext<TopBarRefContextType>({})

const TopBarRefProvider = ({children}: Props) => {
  const {htmlNode, callbackRef} = useCallbackRef()
  return (
    <TopBarRefContext.Provider value={{htmlNode, callbackRef}}>
      {children}
    </TopBarRefContext.Provider>
  )
}

export const useTopBarRef = () => useContext(TopBarRefContext)

export const RefProviders = ({children}: Props) => (
  <TopBarRefProvider>
    <MobileStakingSettingsRefProvider>{children}</MobileStakingSettingsRefProvider>
  </TopBarRefProvider>
)
