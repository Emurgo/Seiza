import IsEmail from 'isemail'
import {ApolloError} from 'apollo-server'

export const subscribe = async (context, contactEmail) => {
  if (!IsEmail.validate(contactEmail)) {
    throw new ApolloError('Email is not a valid email', 'INVALID_EMAIL')
  }
  return await context.activeCampaign.subscribe(contactEmail)
}
