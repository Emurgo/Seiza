import React from 'react'
import classnames from 'classnames'
import {Route} from 'react-router-dom'

import {Link} from '@/components/visual'

// TODO: make this reuseable and also use for main navigation
// eslint-disable-next-line
// Taken from: https://stackoverflow.com/questions/49962495/integrate-react-router-active-navlink-with-child-component
export default ({to, children, className, activeClassName, ...rest}) => {
  const path = typeof to === 'object' ? to.pathname : to
  return (
    <Route
      path={path}
      children={({location, match}) => {
        const isActive = !!match
        return (
          <Link {...rest} className={classnames(className, isActive && activeClassName)} to={to}>
            {typeof children === 'function' ? children(isActive) : children}
          </Link>
        )
      }}
    />
  )
}
