// @flow
import React from 'react'
import {withState, defaultProps, withHandlers} from 'recompose'
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
    onSearch,
    inputRef,
    classes,
    textFieldProps,
  } = props

  return (
    <div className={classes.container}>
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
      <Button primary variant="contained" className={classes.searchButton} onClick={onSearch}>
        <Search fontSize="large" />
      </Button>
    </div>
  )
}

export default compose(
  defaultProps({
    // eslint-disable-next-line
    onSearch: () => {},
    // eslint-disable-next-line
    onChange: () => {},
    textFieldProps: {},
  }),
  withState('inputRef', 'setInputRef', React.createRef()),
  withHandlers({
    onSearch: ({value, onSearch}) => () => onSearch(value),
    clearInput: ({onChange, inputRef}) => () => {
      onChange('')
      inputRef.current && inputRef.current.focus()
    },
    handleOnChangeEvent: ({onChange}) => (event) => onChange(event.target.value),
  }),
  withStyles(styles)
)(Searchbar)
