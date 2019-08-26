// @flow
import * as React from 'react'

type ContextType = {
  exactMatch: ?boolean,
  setExactMatch: Function,
  toggleExactMatch: Function,
}

const Context = React.createContext<ContextType>({
  exactMatch: false,
  setExactMatch: null,
  toggleExactMatch: null,
})

export type ExactMatchProviderProps = {|
  children: React.Node,
|}

export const ExactMatchProvider = ({children}: ExactMatchProviderProps) => {
  const [exactMatch, setExactMatch] = React.useState(null)

  const toggleExactMatch = React.useCallback(() => setExactMatch(!exactMatch), [
    setExactMatch,
    exactMatch,
  ])

  return (
    <Context.Provider
      value={{
        exactMatch,
        setExactMatch,
        toggleExactMatch,
      }}
    >
      {children}
    </Context.Provider>
  )
}

export const useExactMatchContext = (): ContextType => React.useContext(Context)
