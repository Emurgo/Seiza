// @flow
import React from 'react'
import {defineMessages} from 'react-intl'
import {compose} from 'redux'
import {withStateHandlers, withHandlers} from 'recompose'
import {withRouter} from 'react-router'

import {withI18n} from '@/i18n/helpers'
import Searchbar from '@/components/visual/Searchbar'
import {routeTo} from '@/helpers/routes'

const text = defineMessages({
  searchPlaceholder: 'Search addresses, epochs & slots on the Cardano network',
})

export default compose(
  withRouter,
  withI18n,
  withStateHandlers(
    {
      searchText: '',
    },
    {
      setSearchText: () => (searchText) => ({searchText}),
    }
  ),
  withHandlers({
    onSearch: ({history}) => (query) => history.push(routeTo.search(query)),
  })
)(({i18n, searchText, setSearchText, onChange, onSearch}) => {
  const {translate} = i18n
  return (
    <div style={{width: '45%', margin: '0 auto'}}>
      <Searchbar
        placeholder={translate(text.searchPlaceholder)}
        value={searchText}
        onChange={setSearchText}
        onSearch={onSearch}
      />
    </div>
  )
})
