// @flow

import React, {useRef, useEffect} from 'react'
import cn from 'classnames'
import {makeStyles} from '@material-ui/styles'

import PerfectScrollbar from 'react-perfect-scrollbar'
import 'react-perfect-scrollbar/dist/css/styles.css'

// TODO: can we exchange for slider with better API?
// Note: ignores y-axis for now, implement later if ever needed

// Note: this lib does not give any normal styles api so we hard-override
const imp = (str) => `${str}!important`

const useStyles = makeStyles((theme) => ({
  custom: ({thumbColor, railColor, size, railOffset}) => {
    const height = imp(`${size}px`)
    const borderRadius = imp('20px') // should be ok for any normal size
    return {
      '& .ps__thumb-x': {
        backgroundColor: imp(thumbColor),
        bottom: imp(0),
        borderRadius,
        height,
      },
      '& .ps__rail-x': {
        backgroundColor: imp(railColor),
        marginLeft: imp(`${railOffset}px`),
        marginRight: imp(`${railOffset}px`),
        borderRadius,
        height,
      },
    }
  },
}))

type Props = {|
  children: React$Node,
  thumbColor?: string,
  railColor?: string,
  railOffset?: number,
  size?: number,
|}

const useUpdateAfterDimChange = (scrollbarRef) => {
  useEffect(() => {
    const update = () => {
      scrollbarRef.current && scrollbarRef.current.updateScroll()
    }

    window.addEventListener('resize', update)
    return function cleanup() {
      window.removeEventListener('resize', update)
    }
  })
}

// Note: colors look quite ok will all themes, so can be moved to theme object later if needed
export default ({
  children,
  thumbColor = 'rgba(18, 5, 70, 0.15)',
  railColor = 'rgba(18, 5, 70, 0.05)',
  size = 3,
  railOffset = 10,
}: Props) => {
  const classes = useStyles({thumbColor, railColor, size, railOffset})
  const scrollbarRef = useRef(null)

  useUpdateAfterDimChange(scrollbarRef)

  // Note: applying custom 'classname' causes broken scrolling after reload,
  // because it removes 'ps' class (:wtf-really), therefore we add it
  return (
    <PerfectScrollbar ref={scrollbarRef} className={cn('ps', classes.custom)}>
      {children}
    </PerfectScrollbar>
  )
}
