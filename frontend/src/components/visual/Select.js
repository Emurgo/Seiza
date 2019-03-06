import React from 'react'
import classnames from 'classnames'
import {withStyles, OutlinedInput, FormControl, FormLabel, NativeSelect} from '@material-ui/core'

const StyledNativeSelect = withStyles({
  select: {
    paddingTop: '10px',
    paddingBottom: '10px',
  },
})(NativeSelect)

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
    <StyledNativeSelect value={value} onChange={onChange} input={<OutlinedInput labelWidth={0} />}>
      {options.map(({value, label}) => (
        <option key={value} value={value}>
          {label}
        </option>
      ))}
    </StyledNativeSelect>
  </FormControl>
)

export default withStyles(styles)(Select)
