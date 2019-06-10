import axios from 'axios'
import assert from 'assert'
assert(process.env.ACTIVE_CAMPAIGN_URL)
// we don't want to create server.com//url later on
assert(!process.env.ACTIVE_CAMPAIGN_URL.endsWith('/'))
assert(process.env.ACTIVE_CAMPAIGN_KEY)
assert(process.env.ACTIVE_CAMPAIGN_LIST_ID)
assert(/^\d+$/g.test(process.env.ACTIVE_CAMPAIGN_LIST_ID), 'Incorrect ActiveCampaign list Id')

const axiosInstance = axios.create({
  baseURL: `${process.env.ACTIVE_CAMPAIGN_URL}/api/3`,
  timeout: 5000, // what should timeout be?
  headers: {'Api-Token': process.env.ACTIVE_CAMPAIGN_KEY},
})

export class InvalidEmail extends Error {}
export class ApiCallFailed extends Error {}

export const getActiveCampaign = (logger) => {
  const CONTACT_STATUS_ACTIVE = 1 // see docs for other values
  // https://developers.activecampaign.com/reference#create-contact-sync
  // https://developers.activecampaign.com/reference#update-list-status-for-contact
  // /contact/sync returns success response in case of contact(email) already exists
  const subscribe = async (email) => {
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
          throw new InvalidEmail('Invalid email')
        } else {
          throw new ApiCallFailed('contact/sync', error)
        }
      })

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
      .catch((error) => {
        throw new ApiCallFailed('/contactLists', error)
      })
  }

  return {
    subscribe,
    InvalidEmail,
    ApiCallFailed,
  }
}
