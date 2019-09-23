// @flow
import React, {useCallback, useMemo} from 'react'
import cn from 'classnames'
import {InputAdornment, TextField} from '@material-ui/core'
import {makeStyles} from '@material-ui/styles'
import {Search} from '@material-ui/icons'
import {fade} from '@material-ui/core/styles/colorManipulator'

import {Button, LoadingInProgress, CloseIconButton} from '@/components/visual'

import type {ElementRef} from 'react'

const BORDER_RADIUS = 5

const useStyles = makeStyles((theme) => ({
  shadow: {
    'boxShadow': `0px 10px 20px 0px ${fade(theme.palette.shadowBase, 0.08)}`,
    '&:hover': {
      boxShadow: `0px 10px 30px 0px ${fade(theme.palette.shadowBase, 0.12)}`,
    },
  },
  container: {
    display: 'flex',
    flex: 1,
  },
  searchButton: {
    borderBottomLeftRadius: ({rounded}) => (rounded ? BORDER_RADIUS : 0),
    borderTopLeftRadius: ({rounded}) => (rounded ? BORDER_RADIUS : 0),
    padding: 0,
    boxShadow: 'none',
  },
}))

const useTextFieldStyles = makeStyles((theme) => ({
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
  closeButton: {
    // Note: applied only to Close button, not loading, as the button "padding/shadow"
    // makes it wider
    left: 10,
  },
}))

type ExternalProps = {
  placeholder: string,
  value: string,
  onSearch: (str: string) => any,
  onChange: (event: any) => any,
  onReset?: Function, // TODO: make required
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
  hasShadow?: boolean,
}

// TODO: use hooks
class _SearchbarTextField extends React.Component<SearchbarTextFieldProps> {
  inputRef: {current: null | ElementRef<'input'>}

  static defaultProps = {
    hasShadow: true,
  }

  constructor(props: SearchbarTextFieldProps) {
    super(props)
    this.inputRef = React.createRef()
  }

  clearInput = () => {
    this.props.onReset()
    this.inputRef.current && this.inputRef.current.focus()
  }

  render() {
    const {
      placeholder,
      value,
      onChange,
      classes,
      loading,
      inputProps,
      className,
      onReset,
      hasShadow,
    } = this.props

    return (
      <TextField
        type="text"
        className={cn(classes.textField, hasShadow && classes.shadow, className)}
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
              ) : onReset ? (
                <CloseIconButton
                  className={classes.closeButton}
                  aria-label="Clear-search"
                  onClick={this.clearInput}
                />
              ) : null}
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

export const SearchbarTextField = ({rounded, ...props}: SearchbarTextFieldExternalProps) => {
  const textFieldClasses = useTextFieldStyles({rounded})
  const wrapperClasses = useStyles()
  const classes = useMemo(() => ({...textFieldClasses, shadow: wrapperClasses.shadow}), [
    textFieldClasses,
    wrapperClasses,
  ])
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
  <form className={cn(classes.container, classes.shadow)} onSubmit={onSubmit}>
    <SearchbarTextField
      hasShadow={false}
      {...{value, placeholder, onReset, loading, inputProps, onChange}}
    />
    <Button type="submit" variant="contained" className={classes.searchButton}>
      <Search fontSize="large" />
    </Button>
  </form>
)

export default ({onSearch, value, onChange, onReset, ...restProps}: ExternalProps) => {
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
  const _onReset = useCallback(() => (onReset ? onReset() : onSearch('')), [onReset, onSearch])

  const classes = useStyles()

  return (
    <Searchbar
      {...{classes, onSubmit, value, onSearch, ...restProps}}
      onReset={_onReset}
      onChange={handleOnChangeEvent}
    />
  )
}
