import {compose} from 'redux'
import {withRouter} from 'react-router'
import {withHandlers} from 'recompose'

const WithNavigateTo = compose(
  withRouter,
  withHandlers({
    navigate: ({history, to}) => () => history.push(to),
  })
)(({children, navigate}) => children({navigate}))

export default WithNavigateTo
