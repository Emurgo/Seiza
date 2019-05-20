// @flow
import React from 'react'
import type {ElementRef} from 'react'
import {withHandlers} from 'recompose'
import {compose} from 'redux'
import {withStyles, createStyles, InputAdornment, TextField} from '@material-ui/core'
import {Search} from '@material-ui/icons'
import {Button, LoadingInProgress, CloseIconButton} from '@/components/visual'
import {fade} from '@material-ui/core/styles/colorManipulator'

const styles = (theme) =>
  createStyles({
    textField: {
      flex: 1,
      flexBasis: 500,
      background: theme.palette.background.paper,
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
      height: 58, // Note: in sync with textField style
      boxShadow: 'none',
    },
    container: {
      'display': 'flex',
      'flex': 1,
      'boxShadow': `0px 10px 20px 0px ${fade(theme.palette.shadowBase, 0.08)}`,
      '&:hover': {
        boxShadow: `0px 10px 30px 0px ${fade(theme.palette.shadowBase, 0.12)}`,
      },
    },
  })

type ExternalProps = {
  placeholder: string,
  value: string,
  onSearch: (str: string) => any,
  textFieldProps?: Object,
  onChange: (event: any) => any,
  loading?: boolean,
}

type Props = {
  ...$Exact<ExternalProps>,
  handleOnChangeEvent: (event: any) => any,
  onSubmit: (event: Object) => any,
  classes: Object,
}

class Searchbar extends React.Component<Props> {
  inputRef: {current: null | ElementRef<'input'>}

  constructor(props) {
    super(props)
    this.inputRef = React.createRef()
  }

  clearInput = () => {
    this.props.onChange('')
    this.inputRef.current && this.inputRef.current.focus()
  }

  render() {
    const {
      placeholder,
      value,
      handleOnChangeEvent,
      onSubmit,
      classes,
      textFieldProps,
      loading,
    } = this.props

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
                {loading ? (
                  <LoadingInProgress size={30} />
                ) : (
                  <CloseIconButton aria-label="Clear-search" onClick={this.clearInput} />
                )}
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

export default (compose(
  withHandlers({
    onSubmit: ({onSearch, value}) => (event) => {
      event.preventDefault()
      onSearch(value)
    },
    handleOnChangeEvent: ({onChange}) => (event) => onChange(event.target.value),
  }),
  withStyles(styles)
)(Searchbar): React$ComponentType<ExternalProps>)
