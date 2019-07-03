// @flow
import React from 'react'

import {SubscribeProvider} from './context/subscribe'
import SubscribeFooter from './SubscribeFooter'
import MainFooter from './MainFooter'

type Props = {|
  navItems: $ReadOnlyArray<{link: string, label: string, disabledText?: ?string}>,
|}

const Footer = ({navItems}: Props) => (
  <SubscribeProvider>
    <SubscribeFooter />
    <MainFooter navItems={navItems} />
  </SubscribeProvider>
)

export default Footer
