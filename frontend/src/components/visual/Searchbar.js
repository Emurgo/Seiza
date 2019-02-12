// @flow
import React from 'react'
import InputAdornment from '@material-ui/core/InputAdornment'
import TextField from '@material-ui/core/TextField'
import {withStyles, createStyles} from '@material-ui/core'
import IconButton from '@material-ui/core/IconButton'
import Close from '@material-ui/icons/Close'
import Button from '@material-ui/core/Button'
import Search from '@material-ui/icons/Search'
import {injectIntl, defineMessages} from 'react-intl'
import {compose} from 'redux'
import {getIntlFormatters} from '../../i18n/helpers'
import {withStateHandlers, withHandlers, defaultProps} from 'recompose'

const styles = (theme) =>
  createStyles({
    textField: {
      flexBasis: 200,
      width: 500,
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
      background: 'linear-gradient(97deg, #715BD3 0%, #95BAF7 100%)',
      color: 'white',
      borderBottomLeftRadius: 0,
      borderTopLeftRadius: 0,
      height: 56,
      boxShadow: 'none',
    },
  })

const text = defineMessages({
  searchPlaceholder: {
    id: 'searchbar.placeholder',
    defaultMessage: 'Search addresses, epochs & slots on the Cardano network',
  },
})

type PropTypes = {
  classes: Object,
}

const Searchbar = ({
  classes,
  intl,
  search,
  searchText,
  setSearchText,
  clearInput,
  setInputRef,
  inputRef,
}: PropTypes) => {
  const {translate} = getIntlFormatters(intl)
  return (
    <div>
      <TextField
        id="outlined-adornment-password"
        type="text"
        className={classes.textField}
        variant="outlined"
        placeholder={translate(text.searchPlaceholder)}
        value={searchText}
        onChange={(event) => setSearchText(event.target.value)}
        inputRef={setInputRef}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="Toggle password visibility"
                onClick={() => {
                  clearInput()
                  inputRef.focus()
                }}
              >
                <Close />
              </IconButton>
            </InputAdornment>
          ),
          className: classes.input,
        }}
      />
      <Button
        variant="contained"
        className={classes.searchButton}
        onClick={() => search(searchText)}
      >
        <Search fontSize="large" />
      </Button>
    </div>
  )
}

const enhance = withStateHandlers(
  ({initialSearchText = ''}) => ({
    searchText: initialSearchText,
    inputRef: null,
  }),
  {
    clearInput: ({searchText}) => () => ({searchText: ''}),
    setSearchText: () => (value) => ({searchText: value}),
    setInputRef: () => (ref) => ({inputRef: ref}),
  }
)
export default compose(
  defaultProps({
    search: () => {},
  }),
  enhance,
  injectIntl,
  withStyles(styles)
)(Searchbar)
