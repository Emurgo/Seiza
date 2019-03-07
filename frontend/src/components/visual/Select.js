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
  },
  formControl: {
    margin: theme.spacing.unit,
  },
})

const Select = ({classes, value, onChange, options, label, className}) => (
  <FormControl variant="outlined" className={classnames(classes.formControl, className)}>
    {label && (
      <FormLabel className={classes.label} component="legend">
        {label}
      </FormLabel>
    )}
    <StyledSelect value={value} onChange={onChange} input={<OutlinedInput labelWidth={0} />}>
      {options.map(({value, label}) => (
        <MenuItem key={label} value={value}>
          {label}
        </MenuItem>
      ))}
    </StyledSelect>
  </FormControl>
)

export default withStyles(styles)(Select)
