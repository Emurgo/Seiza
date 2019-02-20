// @flow
import React from 'react'
import {injectIntl, defineMessages} from 'react-intl'
import {compose} from 'redux'
import {withState} from 'recompose'

import {getIntlFormatters} from '../../i18n/helpers'
import Searchbar from '../../components/visual/Searchbar'

const text = defineMessages({
  searchPlaceholder: {
    id: 'overview.search.placeholder',
    defaultMessage: 'Search addresses, epochs & slots on the Cardano network',
  },
})

export default compose(
  injectIntl,
  withState('searchText', 'setSearchText', '')
)(({intl, searchText, setSearchText, onChange}) => {
  const {translate} = getIntlFormatters(intl)
  return (
    <div style={{width: '45%', margin: '0 auto'}}>
      <Searchbar
        placeholder={translate(text.searchPlaceholder)}
        value={searchText}
        onChange={setSearchText}
        onSearch={() => null}
      />
    </div>
  )
})
