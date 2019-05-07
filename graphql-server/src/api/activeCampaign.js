import axios from 'axios'
import assert from 'assert'
import {ApolloError} from 'apollo-server'

assert(process.env.ACTIVE_CAMPAIGN_URL)
assert(process.env.ACTIVE_CAMPAIGN_KEY)
assert(process.env.ACTIVE_CAMPAIGN_LIST_ID)
assert(/^\d+$/g.test(process.env.ACTIVE_CAMPAIGN_LIST_ID), 'Incorrect ActiveCampaign list Id')

const axiosInstance = axios.create({
  baseURL: `${process.env.ACTIVE_CAMPAIGN_URL}/api/3`,
  timeout: 5000, // what should timeout be?
  headers: {'Api-Token': process.env.ACTIVE_CAMPAIGN_KEY},
})

const genericACErrorHandler = (error) => {
  if (error instanceof ApolloError) {
    throw error
  }
  // eslint-disable-next-line no-console
  console.log(error)
  throw new ApolloError('SubscriptionError', 'SUBSCRIPTION_ERROR')
}

const CONTACT_STATUS_ACTIVE = 1 // see docs for other values
// https://developers.activecampaign.com/reference#create-contact-sync
// https://developers.activecampaign.com/reference#update-list-status-for-contact
// /contact/sync returns success response in case of contact(email) already exists
export const subscribe = async (email) => {
  const contactBody = {
    contact: {
      email,
    },
  }

  const contactId = await axiosInstance
    .post('/contact/sync', contactBody)
    .then((res) => res.data.contact.id)
    .catch((error) => {
      // 422 is probably only in case of invalid email
      // (though docs don't mention 422 at this call)
      if (error.response && error.response.status === 422) {
        throw new ApolloError('Email is not a valid email', 'INVALID_EMAIL')
      }
      throw error
    })
    .catch(genericACErrorHandler)

  assert(contactId)

  const listBody = {
    // make contact's subscription to target list id active.
    contactList: {
      list: process.env.ACTIVE_CAMPAIGN_LIST_ID,
      contact: contactId,
      status: CONTACT_STATUS_ACTIVE,
    },
  }
  return await axiosInstance
    .post('/contactLists', listBody)
    .then((res) => true)
    .catch(genericACErrorHandler)
}
