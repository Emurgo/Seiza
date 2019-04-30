import React, {useCallback} from 'react'
import {Link as RouterLink} from 'react-router-dom'

import analytics from '@/helpers/googleAnalytics'

const Link = ({to, children, target = '_self', underline, className}) => {
  // Note: does not handle redirects
  const onClick = useCallback(() => analytics.trackUrlChange(to), [to])
  return <RouterLink {...{onClick, to, target, underline, className}}>{children}</RouterLink>
}

export default Link
