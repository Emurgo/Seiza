// @flow

export type Storage = {|
  getItem: (key: string) => any,
  setItem: (key: string, value: any) => void,
|}

type StorageType = 'local' | 'session'

export const _getStorage = (storage: Object, type: StorageType): Storage => {
  const setItem = (key: string, item: any) => {
    storage.setItem(key, JSON.stringify(item))
  }

  const getItem = (key: string): any => {
    const item = storage.getItem(key)
    try {
      return item ? JSON.parse(item) : null
    } catch (err) {
      // eslint-disable-next-line
      console.log(`Could not get "${key}" from ${type} storage`)
      storage.removeItem(key)
    }
    return null
  }

  return {
    setItem,
    getItem,
  }
}
