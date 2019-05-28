// @flow
export const getPageAndBoundaryFromCursor = (cursor: ?number, rowsPerPage: number) => {
  return cursor == null || cursor % rowsPerPage === 0
    ? {
      nextPageNumber: null,
      pageBoundary: null,
    }
    : {
      nextPageNumber: 1 + Math.floor(cursor / rowsPerPage),
      pageBoundary: cursor % rowsPerPage,
    }
}
