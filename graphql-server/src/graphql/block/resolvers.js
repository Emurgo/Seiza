import {facadeBlock} from './dataFacades'

// TODO: consider variable page size
const PAGE_SIZE = 10

const _getNextPages = async (pageOne, context) => {
  const fetchedPage = pageOne.fetchedPage
  const nextPagesCount = Math.ceil(pageOne.data.length / 10)
  const nextPagesIDs = new Array(nextPagesCount)
    .fill(0)
    .map((_, i) => fetchedPage - i - 1)
    .filter((page) => page >= 1)

  const nextPagePromises = nextPagesIDs.map((nextPageID) => {
    const nextPageQuery = `?pageSize=${PAGE_SIZE}&page=${nextPageID}`
    return context.cardanoAPI.get(`blocks/pages${nextPageQuery}`).then((data) => {
      return data[1].map(facadeBlock)
    })
  })
  const _nextPages = await Promise.all(nextPagePromises)
  return _nextPages.reduce((res, page) => res.concat(page), [])
}

const _mergePages = (initialPage, nextPages, cursor) => {
  const blocksCountFromPageOne = (initialPage.fetchedPage - 1) * PAGE_SIZE + initialPage.data.length
  const nextCursor = cursor ? cursor - PAGE_SIZE : blocksCountFromPageOne - PAGE_SIZE

  if (cursor) {
    const blocksfromFirstPageCount = PAGE_SIZE - (blocksCountFromPageOne - cursor)
    return {
      cursor: nextCursor,
      data: [
        ...initialPage.data.slice(-blocksfromFirstPageCount),
        ...nextPages.slice(0, PAGE_SIZE - blocksfromFirstPageCount),
      ],
    }
  } else {
    return {
      cursor: nextCursor,
      data: [...initialPage.data, ...nextPages.slice(0, PAGE_SIZE - initialPage.data.length)],
    }
  }
}

// Note: 'pages' are indexed from 1 in cardano API
// Note: 'cursor' means including the position
export const blocksResolver = async (parent, args, context) => {
  const initialPageId = args.cursor && Math.ceil(args.cursor / PAGE_SIZE)
  if (initialPageId < 1) return []

  const initialPageQuery = args.cursor
    ? `?pageSize=${PAGE_SIZE}&page=${initialPageId}`
    : `?pageSize=${PAGE_SIZE}`

  const initialPage = await context.cardanoAPI
    .get(`blocks/pages${initialPageQuery}`)
    .then((data) => {
      // Note: data[0] contain the number of the latest page
      return {fetchedPage: initialPageId || data[0], data: data[1].map(facadeBlock)}
    })
  const nextPages = await _getNextPages(initialPage, context)

  return _mergePages(initialPage, nextPages, args.cursor)
}
