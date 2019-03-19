// @flow

import * as React from 'react'

// Note: we may consider placing this file to more top-level location

type ContextType = {
  autoSync: ?boolean,
  setAutosync: Function,
  toggleAutoSync: Function,
}

const Context = React.createContext<ContextType>({
  autoSync: false,
  setAutosync: null,
  toggleAutoSync: null,
})

export type AutoSyncProviderProps = {|
  children: React.Node,
|}

export const AutoSyncProvider = ({children}: AutoSyncProviderProps) => {
  const [autoSync, setAutosync] = React.useState(null)

  const toggleAutoSync = React.useCallback(() => setAutosync(!autoSync), [setAutosync, autoSync])

  return (
    <Context.Provider
      value={{
        autoSync,
        setAutosync,
        toggleAutoSync,
      }}
    >
      {children}
    </Context.Provider>
  )
}

export const useAutoSyncContext = (): ContextType => React.useContext(Context)
