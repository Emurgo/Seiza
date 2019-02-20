import {withStateHandlers} from 'recompose'

const WithModalState = withStateHandlers(
  {
    isOpen: false,
  },
  {
    openModal: () => () => ({isOpen: true}),
    closeModal: () => () => ({isOpen: false}),
    toggle: ({isOpen}) => () => ({isOpen: !isOpen}),
  }
)(({children, isOpen, openModal, closeModal, toggle}) =>
  children({isOpen, openModal, closeModal, toggle})
)

// Example usage:
// <WithModalState>{
//   ({isOpen, openModal}) => <div onClick={openModal}><Modal open={isOpen></div>
// }</WithModalState>
export default WithModalState
