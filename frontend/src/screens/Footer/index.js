// @flow
import React from 'react'

import SubscribeFooter from './SubscribeFooter'
import MainFooter from './MainFooter'

type Props = {|
  navItems: $ReadOnlyArray<{link: string, label: string, disabledText?: ?string}>,
|}

const Footer = ({navItems}: Props) => (
  <React.Fragment>
    <SubscribeFooter />
    <MainFooter navItems={navItems} />
  </React.Fragment>
)

export default Footer
