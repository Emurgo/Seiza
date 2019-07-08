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

export const RefProviders = ({children}: Props) => (
  <React.Fragment>
    <MobileStakingSettingsRefProvider>{children}</MobileStakingSettingsRefProvider>
  </React.Fragment>
)
