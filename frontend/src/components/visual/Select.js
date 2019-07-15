import React from 'react'
import classnames from 'classnames'
import {
  withStyles,
  OutlinedInput,
  FormControl,
  FormLabel,
  Select as SelectMUI,
  MenuItem,
} from '@material-ui/core'
import {ArrowDropDown} from '@material-ui/icons'

const StyledArrowDropDownIcon = withStyles(({palette}) => ({
  root: {
    color: palette.contentUnfocus,
  },
}))(ArrowDropDown)

const StyledSelect = withStyles({
  select: {
    paddingTop: '10px',
    paddingBottom: '10px',
    paddingRight: '32px',
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

const Select = ({classes, value, onChange, options, label, className, hasBorder = true}) => {
  const InputComponent = hasBorder ? StyledOutlinedInput : NoBorderInput

  return (
    <FormControl variant="outlined" className={classnames(classes.formControl, className)}>
      {label && (
        <FormLabel className={classes.label} component="legend">
          {label}
        </FormLabel>
      )}
      <StyledSelect
        value={value}
        onChange={onChange}
        input={<InputComponent labelWidth={0} />}
        IconComponent={StyledArrowDropDownIcon}
      >
        {options.map(({value, label}) => (
          <StyledMenuItem key={value} value={value}>
            {label}
          </StyledMenuItem>
        ))}
      </StyledSelect>
    </FormControl>
  )
}

export default withStyles(styles)(Select)
