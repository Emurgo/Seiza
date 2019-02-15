import {withStateHandlers} from 'recompose'

const WithModalState = withStateHandlers(
  {
    isOpen: false,
  },
  {
    openModal: () => () => ({isOpen: true}),
    closeModal: () => () => ({isOpen: false}),
  }
)(({children, isOpen, openModal, closeModal}) => children({isOpen, openModal, closeModal}))

// Example usage:
// <WithModalState>{
//   ({isOpen, openModal}) => <div onClick={openModal}><Modal open={isOpen></div>
// }</WithModalState>
export default WithModalState
