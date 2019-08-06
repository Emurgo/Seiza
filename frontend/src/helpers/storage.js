// @flow

export type Storage = {|
  getItem: (key: string) => any,
  setItem: (key: string, value: any) => void,
  removeItem: (key: string) => void,
|}

type StorageType = 'local' | 'session' | 'cookie'

export const toStorageFormat = JSON.stringify

export const parseStorageFormat = JSON.parse

export const _getStorage = (storage: Object, type: StorageType): Storage => {
  const setItem = (key: string, item: any) => {
    storage.setItem(key, toStorageFormat(item))
  }

  const getItem = (key: string): any => {
    const item = storage.getItem(key)
    try {
      return item ? parseStorageFormat(item) : null
    } catch (err) {
      // eslint-disable-next-line
      console.log(`Could not get "${key}" from ${type} storage`)
      storage.removeItem(key)
    }
    return null
  }

  const removeItem = (key: string): void => storage.removeItem(key)

  return {
    setItem,
    getItem,
    removeItem,
  }
}
