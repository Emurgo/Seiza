import {withProps, withHandlers, withStateHandlers} from 'recompose'
import {compose} from 'redux'
import copyToClipboard from 'copy-to-clipboard'

const WithCopyToClipboard = compose(
  withStateHandlers(
    {
      copiedValue: {}, // Note: empty object because !== null/undefined
    },
    {
      registerCopy: () => (copiedValue) => ({copiedValue}),
    }
  ),
  withProps(({copiedValue, value}) => ({
    isCopied: copiedValue === value,
  })),
  withHandlers({
    copy: ({value, registerCopy}) => () => {
      copyToClipboard(value)
      registerCopy(value)
    },
  })
)(({children, copy, isCopied}) => children({copy, isCopied}))

// Example usage:
// <WithCopyToClipboard value={value}>{
//   ({copy, isCopied}) => <div onClick={copy}>Click me</div>
// }</WithCopyToClipboard>
export default WithCopyToClipboard
