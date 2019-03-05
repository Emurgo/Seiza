import React from 'react'

import * as storage from '@/helpers/localStorage'

// TODO: consider moving `JSON.stringify` to storage module
// TODO: dont allow adding more than 'n' pools

const STORAGE_KEY = 'selectedPools'

export const initialSelectedPoolsContext = {
  selectedPoolsContext: {
    selectedPools: [],
    addPool: null,
    removePool: null,
  },
}

const getInitialState = () => {
  try {
    return JSON.parse(storage.getItem(STORAGE_KEY))
  } catch (err) {
    return []
  }
}

export const selectedPoolsProvider = (BaseComponent) =>
  class SelectedPoolsProvider extends React.Component {
    constructor(props) {
      super(props)
      this.state = {
        selectedPools: getInitialState(),
      }
    }

    _setPools = (newPools) => {
      this.setState({selectedPools: newPools})
      storage.setItem(STORAGE_KEY, JSON.stringify(newPools))
    }

    removePool = (poolHash) => {
      if (!this.state.selectedPools.includes(poolHash)) {
        throw new Error(`Could not remove pool ${poolHash}`)
      }
      const newSelectedPools = this.state.selectedPools.filter(
        (_poolHash) => _poolHash !== poolHash
      )
      this._setPools(newSelectedPools)
    }

    addPool = (poolHash) => {
      if (this.state.selectedPools.includes(poolHash)) {
        throw new Error(`Pool ${poolHash} is already added.`)
      }
      const newSelectedPools = [...this.state.selectedPools, poolHash]
      this._setPools(newSelectedPools)
    }

    render() {
      const {
        state: {selectedPools},
        removePool,
        addPool,
      } = this
      return (
        <BaseComponent
          {...this.props}
          selectedPoolsContext={{addPool, removePool, selectedPools}}
        />
      )
    }
  }

export const getSelectedPoolsConsumer = (Context) => (WrappedComponent) => (props) => (
  <Context.Consumer>
    {({selectedPoolsContext}) => (
      <WrappedComponent {...props} selectedPoolsContext={selectedPoolsContext} />
    )}
  </Context.Consumer>
)
