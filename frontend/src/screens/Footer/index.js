// @flow
import React from 'react'
import NoSSR from 'react-no-ssr'

import {SubscribeProvider} from './context/subscribe'
import SubscribeFooter from './SubscribeFooter'
import MainFooter from './MainFooter'

type Props = {|
  navItems: $ReadOnlyArray<{link: string, label: string, disabledText?: ?string}>,
|}

const Footer = ({navItems}: Props) => (
  <SubscribeProvider>
    <NoSSR>
      {/* NoSSR used so we not need to create more pre-cached renders */}
      <SubscribeFooter />
    </NoSSR>
    <MainFooter navItems={navItems} />
  </SubscribeProvider>
)

export default Footer
