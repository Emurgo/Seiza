import {createTestClient} from 'apollo-server-testing'
import gql from 'graphql-tag'
import createServer from './server'

// eslint-disable-next-line no-console
console.log = () => {
  /* be silent */
}

// We need to override this before loading the server
process.env.APOLLO_ENGINE_API_KEY = null
const server = createServer()
const {query} = createTestClient(server)

jest.setTimeout(30000)

const ADDRESS_QUERY = gql`
  query($address58: String!) {
    address(address58: $address58) {
      address58
      transactionsCount
      balance
      totalAdaSent
      totalAdaReceived
    }
  }
`

it('Gets correct results for huge address', async () => {
  const address58 =
    'DdzFFzCqrhsfkegDcdUJAGBRoUP2LVakkby6ntdckcURzBsKmNJ7HmQ6LBwLZxTRVBvhZzuFuX9KUpraDcqhJavm35yeXgS2keJPHfKB'
  const res = await query({
    query: ADDRESS_QUERY,
    variables: {
      address58,
    },
  })

  expect(res).toMatchSnapshot()
})
