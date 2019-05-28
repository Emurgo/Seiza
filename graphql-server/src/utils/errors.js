// @flow
import {ApolloError} from 'apollo-server'

class GenericErrorWithContext extends Error {
  constructor(message: string, ctx: any) {
    super(message)
    this.message = message
    // $FlowFixMe we are creating new property. That is fine ...
    this.ctx = ctx
  }
}

export class ConsistencyError extends GenericErrorWithContext {}

export class EntityNotFoundError extends GenericErrorWithContext {}

export const annotateNotFoundError = (annotation: any) => (err: any) => {
  if (err instanceof EntityNotFoundError) {
    throw new ApolloError('Not found', 'NOT_FOUND', annotation)
  }
  throw err
}
