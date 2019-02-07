import {facadeBlock} from './dataFacades'

export const blocksResolver = (parent, args, context) => {
  return context.cardanoAPI.get('blocks/pages').then((data) => {
    return data[1].map(facadeBlock)
  })
}
