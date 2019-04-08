// @flow
import React from 'react'
import type {ElementRef} from 'react'
import {withHandlers} from 'recompose'
import {compose} from 'redux'
import {withStyles, createStyles, InputAdornment, TextField, IconButton} from '@material-ui/core'
import {Search} from '@material-ui/icons'
import {ReactComponent as Close} from '@/assets/icons/close.svg'
import {Button, LoadingInProgress} from '@/components/visual'

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
      display: 'flex',
      flex: 1,
    },
    iconButton: {
      'color': theme.palette.contentUnfocus,
      '&:hover': {
        color: theme.palette.primary.main,
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
                ) : this.props.value ? (
                  <IconButton
                    className={classes.iconButton}
                    color="primary"
                    aria-label="Clear-search"
                    onClick={this.clearInput}
                  >
                    <Close />
                  </IconButton>
                ) : null}
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
