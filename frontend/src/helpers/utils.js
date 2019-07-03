// @flow

export const toIntOrNull = (v: string) => {
  const ret = parseInt(v, 10)
  return isNaN(ret) ? null : ret
}

export const getPageCount = (itemsCount: number, rowsPerPage: number) =>
  Math.ceil(itemsCount / rowsPerPage)

// https://www.codevoila.com/post/30/export-json-data-to-downloadable-file-using-javascript
// Note: Consider moving to a separate file if we have more 'data-export' related functions there
export const download = (fileName: string, data: string) => {
  const dataUri = `data:application/json;base64,${btoa(data)}`
  const linkElement = document.createElement('a')
  linkElement.setAttribute('href', dataUri)
  linkElement.setAttribute('download', fileName)
  linkElement.click()
}
