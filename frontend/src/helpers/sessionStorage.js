// @flow

export const setItem = (key: string, item: any) => {
  sessionStorage.setItem(key, JSON.stringify(item))
}

export const getItem = (key: string): any => {
  const item = sessionStorage.getItem(key)
  try {
    return item ? JSON.parse(item) : null
  } catch (err) {
    // eslint-disable-next-line
    console.log(`Could not get "${key}" from session storage`)
    sessionStorage.removeItem(key)
  }
  return null
}
