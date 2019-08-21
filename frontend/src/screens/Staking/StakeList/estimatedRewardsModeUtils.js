// @flow

import React, {useContext} from 'react'

import {useCookieState} from '@/components/hooks/useStorageState'

export const ESTIMATED_REWARDS_MODES = {
  PERCENTAGE: 'percentage',
  EPOCH: 'epoch',
  YEAR: 'year',
}

type ContextType = {
  estimatedRewardsMode: $Values<typeof ESTIMATED_REWARDS_MODES>,
  setEstimatedRewardsMode: Function,
}

export const Context = React.createContext<ContextType>({})

type Props = {|
  children: React$Node,
|}

export const EstimatedRewardsModeProvider = ({children}: Props) => {
  const [estimatedRewardsMode, setEstimatedRewardsMode] = useCookieState(
    'rewards-mode',
    ESTIMATED_REWARDS_MODES.YEAR
  )

  return (
    <Context.Provider value={{estimatedRewardsMode, setEstimatedRewardsMode}}>
      {children}
    </Context.Provider>
  )
}

export const useEstimatedRewardsMode = () => useContext(Context)
