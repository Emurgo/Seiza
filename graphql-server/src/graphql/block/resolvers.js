import {facadeBlock} from './dataFacades'

// TODO: consider using blockHash as 'cursor' instead of 'page'
// TODO: smarter fetching (if fetching the latest block, fetch also the next one)
// TODO: page size
export const blocksResolver = (parent, args, context) => {
  const query = args.page ? `?page=${args.page}` : ''
  return context.cardanoAPI.get(`blocks/pages${query}`).then((data) => {
    // Note: data[0] contain the number of the latest page
    return {fetchedPage: args.page || data[0], data: data[1].map(facadeBlock)}
  })
}
