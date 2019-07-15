// @flow
import React from 'react'
import type {ElementRef} from 'react'
import {withHandlers} from 'recompose'
import {compose} from 'redux'
import {withStyles, InputAdornment, TextField} from '@material-ui/core'
import {Search} from '@material-ui/icons'
import {Button, LoadingInProgress, CloseIconButton} from '@/components/visual'
import {fade} from '@material-ui/core/styles/colorManipulator'

const styles = (theme) => ({
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
    '&:hover': {
      '&>fieldset': {
        borderColor: `${theme.palette.secondary.main} !important`,
      },
    },
  },
  // eslint-disable-next-line
    // https://github.com/wheredoesyourmindgo/react-mui-mapbox-geocoder/issues/2#issuecomment-478668535
  focusedInput: {
    '&>fieldset': {
      borderWidth: '1px !important',
    },
  },
  searchButton: {
    borderBottomLeftRadius: 0,
    borderTopLeftRadius: 0,
    padding: 0,
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
  onChange: (event: any) => any,
  loading?: boolean,
  inputProps?: Object,
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
      loading,
      inputProps,
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
          inputProps={inputProps}
          // eslint-disable-next-line react/jsx-no-duplicate-props
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
            classes: {
              root: classes.input,
              focused: classes.focusedInput,
            },
          }}
        />
        <Button secondary type="submit" variant="contained" className={classes.searchButton}>
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
