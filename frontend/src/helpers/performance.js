// @flow

import * as React from 'react'

// Most of the time when optimizing renders using shallow compare inside `shouldComponentUpdate`,
// we should use React.memo, but if for some reason we could not (class component),
// we can use this HOC
export const withPureComponent = <Config: {}>(
  BaseComponent: React.AbstractComponent<Config>
): React.AbstractComponent<Config> =>
    class PureComponentWrapper extends React.PureComponent<Config> {
      render() {
        return <BaseComponent {...this.props} />
      }
    }

export const setupWhyDidYouRender = () => {
  const whyDidYouRender = require('@welldone-software/why-did-you-render')
  whyDidYouRender(React, {trackHooks: false}) // For now ignores hooks rerenders
}
