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

const StyledSelect = withStyles({
  select: {
    paddingTop: '10px',
    paddingBottom: '10px',
  },
})(SelectMUI)

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

const Select = ({classes, value, onChange, options, label, className, hasBorder = true}) => {
  const InputComponent = hasBorder ? OutlinedInput : NoBorderInput
  return (
    <FormControl variant="outlined" className={classnames(classes.formControl, className)}>
      {label && (
        <FormLabel className={classes.label} component="legend">
          {label}
        </FormLabel>
      )}
      <StyledSelect value={value} onChange={onChange} input={<InputComponent labelWidth={0} />}>
        {options.map(({value, label}) => (
          <MenuItem key={value} value={value}>
            {label}
          </MenuItem>
        ))}
      </StyledSelect>
    </FormControl>
  )
}

export default withStyles(styles)(Select)
