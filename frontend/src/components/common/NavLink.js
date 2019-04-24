import React from 'react'
import classnames from 'classnames'
import {Route, Link} from 'react-router-dom'

// TODO: make this reuseable and also use for main navigation
// eslint-disable-next-line
// Taken from: https://stackoverflow.com/questions/49962495/integrate-react-router-active-navlink-with-child-component
export default ({to, children, className, activeClassName, getIsActive, ...rest}) => {
  const path = typeof to === 'object' ? to.pathname : to
  return (
    <Route
      path={path}
      children={({location, match}) => {
        const isActive = getIsActive ? getIsActive(location.pathname) : !!match
        return (
          <Link {...rest} className={classnames(className, isActive && activeClassName)} to={to}>
            {typeof children === 'function' ? children(isActive) : children}
          </Link>
        )
      }}
    />
  )
}
