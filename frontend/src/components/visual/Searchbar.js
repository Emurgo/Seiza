// @flow
import React from 'react'
import type {ElementRef} from 'react'
import {withHandlers} from 'recompose'
import {compose} from 'redux'
import {withStyles, createStyles, InputAdornment, TextField, IconButton} from '@material-ui/core'
import {Close, Search} from '@material-ui/icons'
import {Button} from '@/components/visual'

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
  onSearch: (str: string) => any,
  onSubmit: (event: Object) => any,
  classes: Object,
  textFieldProps: Object,
}

class Searchbar extends React.Component<PropTypes> {
  inputRef: {current: null | ElementRef<'input'>}

  constructor(props) {
    super(props)
    this.inputRef = React.createRef()
  }

  clearInput = () => {
    this.props.handleOnChangeEvent('')
    this.inputRef.current && this.inputRef.current.focus()
  }

  render() {
    const {placeholder, value, handleOnChangeEvent, onSubmit, classes, textFieldProps} = this.props

    return (
      <form className={classes.container} onSubmit={onSubmit}>
        <TextField
          type="text"
          className={classes.textField}
          variant="outlined"
          value={value}
          placeholder={placeholder}
          onChange={handleOnChangeEvent}
          inputRef={this.inputRef}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton aria-label="Toggle password visibility" onClick={this.clearInput}>
                  <Close />
                </IconButton>
              </InputAdornment>
            ),
            className: classes.input,
          }}
          {...textFieldProps}
        />
        <Button primary type="submit" variant="contained" className={classes.searchButton}>
          <Search fontSize="large" />
        </Button>
      </form>
    )
  }
}

export default compose(
  withHandlers({
    onSubmit: ({onSearch, value}) => (event) => {
      event.preventDefault()
      onSearch(value)
    },
    handleOnChangeEvent: ({onChange}) => (event) => onChange(event.target.value),
  }),
  withStyles(styles)
)(Searchbar)
