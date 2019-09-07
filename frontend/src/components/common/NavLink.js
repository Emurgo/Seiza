import React from 'react'
import cn from 'classnames'
import {Route, Link} from 'react-router-dom'

// TODO: add flow to this file

export const WithPathActive = ({children, path, getIsActive}) => (
  <Route
    path={path}
    children={({location, match}) => {
      const isActive = getIsActive ? getIsActive({location, match}) : !!match
      return children(isActive)
    }}
  />
)

// TODO: make this reuseable and also use for main navigation
// eslint-disable-next-line
// Taken from: https://stackoverflow.com/questions/49962495/integrate-react-router-active-navlink-with-child-component
export default ({to, children, className, activeClassName, getIsActive, ...rest}) => {
  const path = typeof to === 'object' ? to.pathname : to

  return (
    <WithPathActive {...{path, getIsActive}}>
      {(isActive) => (
        <Link {...rest} className={cn(className, isActive && activeClassName)} to={to}>
          {typeof children === 'function' ? children(isActive) : children}
        </Link>
      )}
    </WithPathActive>
  )
}
