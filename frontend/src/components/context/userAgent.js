// @flow
import React, {useContext} from 'react'
import {isCrawler, isSupportedBrowser} from '@/helpers/userAgent'

export const Context = React.createContext<string>('')

type Props = {|
  userAgent: string,
  children: React$Node,
|}

export const useUserAgent = () => {
  const userAgent = useContext(Context)
  return {
    userAgent,
    isCrawler: isCrawler(userAgent),
    isSupportedBrowser: isSupportedBrowser(userAgent),
  }
}

export const UserAgentProvider = ({userAgent, children}: Props) => (
  <Context.Provider value={userAgent}>{children}</Context.Provider>
)
