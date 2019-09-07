// @flow

import React, {useCallback} from 'react'
import {defineMessages} from 'react-intl'

import {LoadingInProgress, SimpleLayout} from '@/components/visual'
import {LoadingError} from '@/components/common'
import {useManageQueryValue} from '@/components/hooks/useManageQueryValue'
import {toIntOrNull} from '@/helpers/utils'
import {useI18n} from '@/i18n/helpers'

// TODO: load custom pools here, temporarily reused
import {useLoadStakepools} from '@/screens/StakingPools/dataLoaders'
import {FiltersProvider} from '@/screens/StakingPools/filtersUtils'
import {SortOptionsProvider} from '@/screens/StakingPools/sortUtils'
import {StakingPools} from '@/screens/StakingPools'

const messages = defineMessages({
  screenTitle: 'Stake pools',
})

export default () => {
  const {translate: tr} = useI18n()

  const {stakepools, loading, error} = useLoadStakepools()
  const [page, setPage] = useManageQueryValue('stake-pools-page', 1, toIntOrNull)

  // TODO: try to reuse this function and Providers from 'StakingPools' folder,
  // but wait till requirements are specified
  // Note: we also reset page when sortBy/filter changes
  const resetPage = useCallback(() => setPage(1), [setPage])
  const onSortByChange = resetPage
  const onFilterChange = resetPage

  return (
    <SimpleLayout title={tr(messages.screenTitle)}>
      {error || loading ? (
        error ? (
          <LoadingError error={error} />
        ) : (
          <LoadingInProgress />
        )
      ) : (
        <SortOptionsProvider onChange={onSortByChange}>
          <FiltersProvider allPools={stakepools} onChange={onFilterChange}>
            <StakingPools {...{page, setPage, stakepools}} />
          </FiltersProvider>
        </SortOptionsProvider>
      )}
    </SimpleLayout>
  )
}
