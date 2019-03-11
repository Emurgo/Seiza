const DebugApolloError = ({error}) => {
  // TODO(ppershing): do not log on subsequent rerenders
  // eslint-disable-next-line
  console.log(error)
  return null
}

export default DebugApolloError
