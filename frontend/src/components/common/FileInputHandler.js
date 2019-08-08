// @flow

import React, {useCallback} from 'react'
import {makeStyles} from '@material-ui/styles'

const useStyles = makeStyles((theme) => ({
  input: {
    display: 'none',
  },
}))

type Props = {|
  children: React$Node,
  onFileLoaded: Function,
  id: string,
|}

// Note: responsibility is to read single file and call given callback with its content.
// For more "advanced" features feel free to update.
const FileInputHandler = ({id, onFileLoaded, children}: Props) => {
  const classes = useStyles()

  const onChange = (e) => {
    // Note: Not created during `render` due to server-side-rendering
    // (fileReader) is not defined on server.
    // Also creating new `FileReader` for every file does not seem as a big overhead.
    const fileReader = new FileReader()
    const handleFileRead = (e) => onFileLoaded(fileReader.result)

    if (!e.target.files || !e.target.files.length) return
    const file = e.target.files[0]

    // Note: ignores error handling
    fileReader.onloadend = handleFileRead

    // Note: make customizable if ever needed
    fileReader.readAsText(file)
  }

  // Note: without this `onChange` is not fired for same file
  const onInputClick = useCallback((event) => {
    event.target.value = ''
  }, [])

  return (
    <React.Fragment>
      <input type="file" className={classes.input} {...{id, onChange}} onClick={onInputClick} />
      <label htmlFor={id}>{children}</label>
    </React.Fragment>
  )
}

// Note: when using custom Button/IconButton inside children, add prop component="span"
export default FileInputHandler
