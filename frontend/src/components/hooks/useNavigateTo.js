import {useCallback} from 'react'
import useReactRouter from 'use-react-router'

export const useNavigateTo = (link) => {
  const {history} = useReactRouter()
  const handler = useCallback(() => history.push(link), [history, link])
  return handler
}

export default useNavigateTo
