import React from 'react'
import {DefaultErrorScreen} from '@/components/common/DefaultErrorBoundary'
// eslint-disable-next-line max-len
// TODO: after we remove express's server.get('*'..): distinguish between PageNotFound and internal server error.
export default () => <DefaultErrorScreen />
