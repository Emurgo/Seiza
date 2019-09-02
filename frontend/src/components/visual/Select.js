import React from 'react'
import classnames from 'classnames'
import {
  withStyles,
  OutlinedInput,
  FormControl,
  FormLabel,
  Select as SelectMUI,
  MenuItem,
  ListItemText,
  Checkbox,
} from '@material-ui/core'
import {ArrowDropDown} from '@material-ui/icons'

const StyledArrowDropDownIcon = withStyles(({palette}) => ({
  root: {
    color: palette.contentUnfocus,
  },
}))(ArrowDropDown)

const commonPadding = {
  paddingTop: '10px !important',
  paddingBottom: '10px !important',
  paddingRight: '32px !important',
}

const StyledSelect = withStyles({
  select: {
    ...commonPadding,
  },
})(SelectMUI)

const StyledMenuItem = withStyles(({palette}) => ({
  selected: {
    backgroundColor: `${palette.unobtrusiveContentHighlight} !important`,
  },
}))(MenuItem)

const styles = (theme) => ({
  label: {
    paddingBottom: '5px',
    textTransform: 'uppercase',
  },
  formControl: {
    margin: theme.spacing(1),
  },
})

const NoBorderInput = withStyles({
  root: {
    '& fieldset': {
      border: 'none',
    },
  },
  input: {
    ...commonPadding,
  },
})(OutlinedInput)

const StyledOutlinedInput = withStyles(({palette}) => ({
  root: {
    'height': '100%',
    // See https://github.com/mui-org/material-ui/issues/13347#issuecomment-435790274
    // for the source of this abomination
    '&:hover:not($disabled):not($focused):not($error) $notchedOutline': {
      borderColor: `${palette.contentFocus} !important`,
    },
  },
  notchedOutline: {
    borderColor: `${palette.contentUnfocus} !important`,
  },
  // Following two classes need to be here so that root's pseudoselector
  // won't complain
  disabled: {},
  error: {},
  focused: {
    'backgroundColor': `${palette.unobtrusiveContentHighlight} !important`,
    '&>fieldset': {
      borderWidth: '1px !important',
      borderColor: `${palette.contentFocus} !important`,
    },
  },
}))(OutlinedInput)

const Select = ({
  classes,
  value,
  onChange,
  options,
  label,
  className,
  renderValue,
  hasBorder = true,
  multiple = false,
}) => {
  const InputComponent = hasBorder ? StyledOutlinedInput : NoBorderInput

  return (
    <FormControl variant="outlined" className={classnames(classes.formControl, className)}>
      {label && (
        <FormLabel className={classes.label} component="legend">
          {label}
        </FormLabel>
      )}
      <StyledSelect
        multiple={multiple}
        value={value}
        onChange={onChange}
        input={<InputComponent labelWidth={0} />}
        IconComponent={StyledArrowDropDownIcon}
        renderValue={renderValue}
      >
        {multiple
          ? options.map(({label, value: currentValue}) => (
            <MenuItem key={currentValue} value={currentValue}>
              <Checkbox checked={value.indexOf(currentValue) > -1} />
              <ListItemText primary={label} />
            </MenuItem>
          ))
          : options.map(({label, value: currentValue}) => (
            <StyledMenuItem key={currentValue} value={currentValue}>
              {label}
            </StyledMenuItem>
          ))}
      </StyledSelect>
    </FormControl>
  )
}

export default withStyles(styles)(Select)
