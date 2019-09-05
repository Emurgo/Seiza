import React from 'react'
import cn from 'classnames'
import {Link, Route} from 'react-router-dom'

const External = ({to, children, className, activeClassName, isActive, ...rest}) => {
  return (
    <a {...rest} href={to} className={cn(className, isActive && activeClassName)}>
      {children}
    </a>
  )
}

const Internal = ({to, children, className, activeClassName, isActive, ...rest}) => {
  return (
    <Link {...rest} className={cn(className, isActive && activeClassName)} to={to}>
      {children}
    </Link>
  )
}

// TODO: make this reuseable and also use for main navigation
// eslint-disable-next-line
// Taken from: https://stackoverflow.com/questions/49962495/integrate-react-router-active-navlink-with-child-component
export default ({
  to,
  type = 'internal',
  children,
  className,
  activeClassName,
  getIsActive,
  ...rest
}) => {
  const path = typeof to === 'object' ? to.pathname : to
  const LinkComponent = type === 'internal' ? Internal : External

  return (
    <Route
      path={path}
      children={({location, match}) => {
        const isActive = getIsActive ? getIsActive({location, match}) : !!match

        return (
          <LinkComponent {...rest} className={cn(className, isActive && activeClassName)} to={to}>
            {typeof children === 'function' ? children(isActive) : children}
          </LinkComponent>
        )
      }}
    />
  )
}
