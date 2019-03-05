// @flow

import React from 'react'
import classnames from 'classnames'
import {Range, Handle} from 'rc-slider'
import {withStyles, FormControl, FormLabel, withTheme, createStyles} from '@material-ui/core'
import {darken, lighten} from '@material-ui/core/styles/colorManipulator'
import {withStateHandlers, withHandlers} from 'recompose'
import {compose} from 'redux'

import 'rc-slider/assets/index.css'
import 'rc-tooltip/assets/bootstrap.css'

const PADDING = 5

const styles = (theme) =>
  createStyles({
    label: {
      paddingBottom: PADDING,
    },
    formControl: {
      margin: theme.spacing.unit,
      width: '100%',
    },
    handle: {
      border: `1px solid ${darken(theme.palette.background.default, 0.05)}`,
    },
    rangeWrapper: {
      paddingTop: '25px',
    },
  })

const getRailStyle = (theme) => ({
  backgroundColor: lighten(theme.palette.primary.light, 0.9),
})

const getTrackStyle = (theme) => ({
  backgroundColor: theme.palette.primary.dark,
  outline: 'none',
  borderShadow: 'none',
})

const getHandleStyle = (theme) => ({
  backgroundColor: theme.palette.primary.dark,
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

  const {value, ...restProps} = props
  const _value = tipFormatter(value)
  const width = estimateTooltipWidth(_value)
  return (
    <div>
      <div
        style={{...handleStyle, width, left: `calc(${props.offset}% - ${width / 2}px)`}}
        className={className}
      >
        {_value}
      </div>
      <Handle value={value} {...restProps} />
    </div>
  )
}

export default compose(
  withStyles(styles),
  withTheme(),
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
    onFocusOff,
    onFocusOn,
    theme,
  }) => {
    const handle = getHandle(classes.handle, tipFormatter)
    return (
      <FormControl className={classnames(classes.formControl, className)}>
        {label && (
          <FormLabel focused={focused} className={classes.label} component="legend">
            {label}
          </FormLabel>
        )}
        <div className={classes.rangeWrapper}>
          <Range
            onAfterChange={onFocusOff}
            onBeforeChange={onFocusOn}
            onChange={onChange}
            trackStyle={[getTrackStyle(theme), getTrackStyle(theme)]}
            handleStyle={[getHandleStyle(theme), getHandleStyle(theme)]}
            railStyle={getRailStyle(theme)}
            {...{min, max, value, handle}}
          />
        </div>
      </FormControl>
    )
  }
)
