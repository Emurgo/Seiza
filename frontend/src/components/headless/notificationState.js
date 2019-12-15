import {withStateHandlers} from 'recompose'

const WithNotificationState = withStateHandlers(
  {
    isOpen: true,
  },
  {
    closeNotif: () => () => ({isOpen: false}),
  }
)(({children, isOpen, closeNotif}) => children({isOpen, closeNotif}))

// Example usage:
// <WithNotificationState>{
//   ({isOpen, closeNotif}) => <div onClick={closeNotif}><NotificationBar open={isOpen}></div>
// }</WithNotificationState>
export default WithNotificationState
