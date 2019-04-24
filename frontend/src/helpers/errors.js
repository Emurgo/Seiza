// @flow
export const ERROR_TYPES = {
  NETWORK_ERROR: 'NETWORK_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  GENERIC: 'GENERIC',
}

const facadeNetworkError = (error: any) => ({
  type: ERROR_TYPES.NETWORK_ERROR,
  error,
})

const facadeGQLError = (error: any) => {
  if (error.extensions.code === 'NOT_FOUND') {
    return {
      type: ERROR_TYPES.NOT_FOUND,
      entity: error.extensions.exception.entity,
      error,
    }
  }
  return {
    type: ERROR_TYPES.GENERIC,
    error,
  }
}

export const extractError = (error: any, path: $ReadOnlyArray<string | number>) => {
  if (!error) return null

  const {networkError, graphQLErrors} = error

  if (networkError) return facadeNetworkError(networkError)

  // First get parent errors
  for (const err of graphQLErrors) {
    if (err.path.length === 0) return facadeGQLError(err)
  }

  // now nest inside
  if (path.length > 0) {
    const [prefix, ...rest] = path
    return extractError(
      {
        graphQLErrors: graphQLErrors
          .filter((e) => e.path[0] === prefix)
          .map((e) => ({
            ...e,
            path: e.path.slice(1),
          })),
      },
      rest
    )
  }

  return null
}
