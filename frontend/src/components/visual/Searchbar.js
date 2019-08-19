// @flow
import React, {useCallback} from 'react'
import cn from 'classnames'
import {InputAdornment, TextField} from '@material-ui/core'
import {makeStyles} from '@material-ui/styles'
import {Search} from '@material-ui/icons'
import {fade} from '@material-ui/core/styles/colorManipulator'

import {Button, LoadingInProgress, CloseIconButton} from '@/components/visual'

import type {ElementRef} from 'react'

const BORDER_RADIUS = 5

const useStyles = makeStyles((theme) => ({
  container: {
    'display': 'flex',
    'flex': 1,
    'boxShadow': `0px 10px 20px 0px ${fade(theme.palette.shadowBase, 0.08)}`,
    '&:hover': {
      boxShadow: `0px 10px 30px 0px ${fade(theme.palette.shadowBase, 0.12)}`,
    },
  },
  searchButton: {
    borderBottomLeftRadius: ({rounded}) => (rounded ? BORDER_RADIUS : 0),
    borderTopLeftRadius: ({rounded}) => (rounded ? BORDER_RADIUS : 0),
    padding: 0,
    boxShadow: 'none',
  },
}))

const useTextFieldsStyles = makeStyles((theme) => ({
  textField: {
    flex: 1,
    flexBasis: 500,
    background: theme.palette.background.paper,
    borderRadius: BORDER_RADIUS,
  },
  input: {
    '&>fieldset': {
      borderBottomRightRadius: ({rounded}) => (rounded ? BORDER_RADIUS : 0),
      borderTopRightRadius: ({rounded}) => (rounded ? BORDER_RADIUS : 0),
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
}))

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
  onSubmit: (event: Object) => any,
  onReset: Function,
  classes: Object,
}

type SearchbarTextFieldExternalProps = {
  placeholder: string,
  value: string,
  onChange: (event: any) => any,
  onReset: Function,
  loading?: boolean,
  inputProps?: Object,
  className?: string,
  rounded?: boolean,
}

type SearchbarTextFieldProps = {
  ...$Exact<SearchbarTextFieldExternalProps>,
  classes: any,
}

// TODO: use hooks
class _SearchbarTextField extends React.Component<SearchbarTextFieldProps> {
  inputRef: {current: null | ElementRef<'input'>}

  constructor(props: SearchbarTextFieldProps) {
    super(props)
    this.inputRef = React.createRef()
  }

  clearInput = () => {
    this.props.onReset()
    this.inputRef.current && this.inputRef.current.focus()
  }

  render() {
    const {placeholder, value, onChange, classes, loading, inputProps, className} = this.props

    return (
      <TextField
        type="text"
        className={cn(classes.textField, className)}
        variant="outlined"
        value={value}
        placeholder={placeholder}
        onChange={onChange}
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
    )
  }
}

export const SearchBarTextField = ({rounded, ...props}: SearchbarTextFieldExternalProps) => {
  const classes = useTextFieldsStyles({rounded})
  return <_SearchbarTextField {...props} classes={classes} />
}

const Searchbar = ({
  placeholder,
  value,
  onChange,
  onSubmit,
  classes,
  loading,
  inputProps,
  onReset,
}: Props) => (
  <form className={classes.container} onSubmit={onSubmit}>
    <SearchBarTextField {...{value, placeholder, onReset, loading, inputProps, onChange}} />
    <Button type="submit" variant="contained" className={classes.searchButton}>
      <Search fontSize="large" />
    </Button>
  </form>
)

export default ({onSearch, value, onChange, ...restProps}: ExternalProps) => {
  const onSubmit = useCallback(
    (event) => {
      event.preventDefault()
      // TODO: consider renaming onSearch into onSubmit
      onSearch(value)
    },
    [onSearch, value]
  )

  const handleOnChangeEvent = useCallback((event) => onChange(event.target.value), [onChange])

  // TODO: refactor in some PR, so that `onReset` is always passed from outside
  const onReset = useCallback(() => onSearch(''), [onSearch])

  const classes = useStyles()

  return (
    <Searchbar
      {...{classes, onReset, onSubmit, value, onSearch, ...restProps}}
      onChange={handleOnChangeEvent}
    />
  )
}
