import {facadeBlock} from './dataFacades'

// TODO: consider variable page size
const PAGE_SIZE = 10

// TODO: make more readable
// Note: 'pages' are indexed from 1 in cardano API
// Note: 'afterPosition' means including the position
// Note: In most cases when a user wants to fetch `{PAGE_SIZE}` latest blocks two calls are needed
export const blocksResolver = async (parent, args, context) => {
  const pageOneID = args.afterPosition && Math.ceil(args.afterPosition / PAGE_SIZE)
  const pageOneQuery = args.afterPosition
    ? `?pageSize=${PAGE_SIZE}&page=${pageOneID}`
    : `?pageSize=${PAGE_SIZE}`

  const pageOne = await context.cardanoAPI.get(`blocks/pages${pageOneQuery}`).then((data) => {
    // Note: data[0] contain the number of the latest page
    return {fetchedPage: pageOneID || data[0], data: data[1].map(facadeBlock)}
  })

  const pageTwoQuery = `?pageSize=${PAGE_SIZE}&page=${pageOne.fetchedPage - 1}`
  const pageTwo = await context.cardanoAPI.get(`blocks/pages${pageTwoQuery}`).then((data) => {
    return {data: data[1].map(facadeBlock)}
  })

  const blocksCountToPageOne = (pageOne.fetchedPage - 1) * PAGE_SIZE + pageOne.data.length
  const cursor = args.afterPosition
    ? args.afterPosition - PAGE_SIZE
    : blocksCountToPageOne - PAGE_SIZE

  if (args.afterPosition) {
    const blocksfromPageFirstCount = PAGE_SIZE - (blocksCountToPageOne - args.afterPosition)
    return {
      cursor,
      data: [
        ...pageOne.data.slice(-blocksfromPageFirstCount),
        ...pageTwo.data.slice(0, PAGE_SIZE - blocksfromPageFirstCount),
      ],
    }
  } else {
    return {
      cursor,
      data: [...pageOne.data, ...pageTwo.data.slice(0, PAGE_SIZE - pageOne.data.length)],
    }
  }
}
