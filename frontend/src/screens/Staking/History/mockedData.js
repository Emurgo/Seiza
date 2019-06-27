// @flow

import _ from 'lodash'

import {PROPERTIES_VALUES} from './common'

const getRandomValue = () => `${_.round(Math.random() * 100, 3)} RANDOM`

const getRandomPropertiesCount = () => Math.ceil(PROPERTIES_VALUES.length * Math.random())

const getChangedProperties = () => {
  const changedPropertiesCount = getRandomPropertiesCount()
  return PROPERTIES_VALUES.slice(0, changedPropertiesCount)
}

// TODO: for now ignores "current" and "next" epoch
// TODO: very simple mock, get real data
export const getMockedHistory = (poolsHashes: Array<string>, toEpoch: number) =>
  _.range(0, toEpoch + 1)
    .map((epochNumber) => {
      const poolsWithChanges = poolsHashes.filter(() => Math.random() > 0.9)
      return poolsWithChanges.length
        ? {
          epochNumber,
          changes: poolsWithChanges.reduce((acc, poolHash) => {
            const changedProperties = getChangedProperties()
            return {
              ...acc,
              [poolHash]: changedProperties.reduce(
                (acc, p) => ({...acc, [p]: getRandomValue()}),
                {}
              ),
            }
          }, {}),
        }
        : null
    })
    .filter((v) => v)
    .reverse()
