import {facadeBlock} from './dataFacades'

// TODO: consider using blockHash as 'cursor' instead of 'page'
// TODO: smarter fetching (if fetching the latest block, fetch also the next one)
export const blocksResolver = (parent, args, context) => {
  const query = args.after ? `?page=${args.after}` : ''
  return context.cardanoAPI.get(`blocks/pages${query}`).then((data) => {
    // Note: data[0] contain the number of the latest page
    return {fetchedPage: args.after || data[0], data: data[1].map(facadeBlock)}
  })
}
