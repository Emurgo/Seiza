// @flow

import React from 'react'
import classnames from 'classnames'
import {Range, Handle} from 'rc-slider'
import {withStyles, FormControl, FormLabel, withTheme} from '@material-ui/core'
import {darken, lighten} from '@material-ui/core/styles/colorManipulator'
import {withStateHandlers, withHandlers} from 'recompose'
import {compose} from 'redux'

import dynamic from 'next/dynamic'
const SliderStyles = dynamic(() => import('./SliderStyles'))

const PADDING = 5

const styles = (theme) => ({
  label: {
    paddingBottom: PADDING,
    textTransform: 'uppercase',
  },
  formControl: {
    width: '100%',
  },
  handle: {
    border: `1px solid ${darken(theme.palette.background.default, 0.05)}`,
    color: theme.palette.secondary.main,
  },
  rangeWrapper: {
    paddingTop: '25px',
  },
})

const getRailStyle = (theme) => ({
  backgroundColor: lighten(theme.palette.secondary.light, 0.9),
})

const getTrackStyle = (theme) => ({
  backgroundColor: theme.palette.secondary.main,
  outline: 'none',
  borderShadow: 'none',
})

const getHandleStyle = (theme) => ({
  backgroundColor: theme.palette.secondary.main,
  border: 'none',
})

const estimateTooltipWidth = (value) => `${value}`.length * 10 + PADDING * 2

// TOOD: `Range` seem to accept only functional component, but `withStyles` returns class
// TODO: consider using hooks
const getHandle = (className, tipFormatter) => (props) => {
  const handleStyle = {
    paddingLeft: PADDING,
    paddingRight: PADDING,
    borderRadius: '5px',
    position: 'absolute',
    top: -(22 + PADDING),
  }
  // Note: `dragging` must be removed to avoid strange console warnings
  const {value, dragging, index, ...restProps} = props // eslint-disable-line
  const _value = tipFormatter(value)
  const width = estimateTooltipWidth(_value)
  return (
    <div key={index}>
      {dragging && (
        <div
          style={{
            ...handleStyle,
            width,
            left: `calc(${props.offset}% - ${width / 2}px)`,
            fontSize: 16,
            textAlign: 'center',
          }}
          className={className}
        >
          {_value}
        </div>
      )}
      <Handle value={value} {...restProps} />
    </div>
  )
}

export default compose(
  withStyles(styles),
  withTheme,
  withStateHandlers(
    {
      focused: false,
    },
    {
      setFocused: () => (focused) => ({focused}),
    }
  ),
  withHandlers({
    onFocusOn: ({setFocused}) => (e) => setFocused(true),
    onFocusOff: ({setFocused}) => (e) => setFocused(false),
  }),
  withHandlers({
    onAfterChange: ({onFocusOff, onDragEnd}) => () => {
      onFocusOff()
      onDragEnd()
    },
  })
)(
  ({
    classes,
    label,
    className,
    min,
    max,
    onChange,
    value,
    tipFormatter,
    focused,
    onAfterChange,
    onFocusOn,
    theme,
    step,
  }) => {
    const handle = getHandle(classes.handle, tipFormatter)
    return (
      <React.Fragment>
        <SliderStyles />
        <FormControl className={classnames(classes.formControl, className)}>
          {label && (
            <FormLabel focused={focused} className={classes.label} component="legend">
              <span>
                {label}
                {tipFormatter(value[0])}&nbsp;-&nbsp;{tipFormatter(value[1])}
              </span>
            </FormLabel>
          )}
          <div className={classes.rangeWrapper}>
            <Range
              onBeforeChange={onFocusOn}
              onChange={onChange}
              trackStyle={[getTrackStyle(theme), getTrackStyle(theme)]}
              handleStyle={[getHandleStyle(theme), getHandleStyle(theme)]}
              railStyle={getRailStyle(theme)}
              {...{min, max, value, handle, onAfterChange, step}}
            />
          </div>
        </FormControl>
      </React.Fragment>
    )
  }
)
