// @flow
import React from 'react'
import {withState, withHandlers} from 'recompose'
import {compose} from 'redux'

import {withStyles, createStyles} from '@material-ui/core'
import InputAdornment from '@material-ui/core/InputAdornment'
import TextField from '@material-ui/core/TextField'
import IconButton from '@material-ui/core/IconButton'
import Close from '@material-ui/icons/Close'
import Button from './Button'
import Search from '@material-ui/icons/Search'

const styles = (theme) =>
  createStyles({
    textField: {
      flex: 1,
      flexBasis: 500,
      background: 'white',
      borderRadius: 5,
    },
    input: {
      '&>fieldset': {
        borderBottomRightRadius: 0,
        borderTopRightRadius: 0,
      },
    },
    searchButton: {
      borderBottomLeftRadius: 0,
      borderTopLeftRadius: 0,
      height: 56, // Note: in sync with textField style
      boxShadow: 'none',
    },
    container: {
      display: 'flex',
      flex: 1,
    },
  })

type PropTypes = {
  placeholder: string,
  value: string,
  handleOnChangeEvent: (str: string) => any,
  clearInput: () => Object,
  onSearch: (str: string) => any,
  onSubmit: (event: Object) => any,
  inputRef: any,
  classes: Object,
  textFieldProps: Object,
}

const Searchbar = (props: PropTypes) => {
  const {
    placeholder,
    value,
    handleOnChangeEvent,
    clearInput,
    onSubmit,
    inputRef,
    classes,
    textFieldProps,
  } = props

  return (
    <form className={classes.container} onSubmit={onSubmit}>
      <TextField
        type="text"
        className={classes.textField}
        variant="outlined"
        value={value}
        placeholder={placeholder}
        onChange={handleOnChangeEvent}
        inputRef={inputRef}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton aria-label="Toggle password visibility" onClick={clearInput}>
                <Close />
              </IconButton>
            </InputAdornment>
          ),
          className: classes.input,
        }}
        {...textFieldProps}
      />
      <Button type="submit" color="primary" variant="contained" className={classes.searchButton}>
        <Search fontSize="large" />
      </Button>
    </form>
  )
}

export default compose(
  withState('inputRef', 'setInputRef', React.createRef()),
  withHandlers({
    onSubmit: ({onSearch, value}) => (event) => {
      event.preventDefault()
      onSearch(value)
    },
    clearInput: ({onChange, inputRef}) => () => {
      onChange('')
      inputRef.current && inputRef.current.focus()
    },
    handleOnChangeEvent: ({onChange}) => (event) => onChange(event.target.value),
  }),
  withStyles(styles)
)(Searchbar)
