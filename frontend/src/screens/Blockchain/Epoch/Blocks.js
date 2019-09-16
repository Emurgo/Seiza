import React, {useState, useEffect} from 'react'
import {defineMessages} from 'react-intl'
import {Grid, Hidden} from '@material-ui/core'
import {makeStyles} from '@material-ui/styles'
import _ from 'lodash'
import assert from 'assert'

import {Pagination, MobilePaginationDivider} from '@/components/common'
import {GET_PAGED_BLOCKS_IN_EPOCH} from '@/api/queries'
import {useI18n} from '@/i18n/helpers'
import {useQueryNotBugged} from '@/components/hooks/useQueryNotBugged'
import {EntityHeading} from '@/components/visual'
import {useManageQueryValue} from '@/components/hooks/useManageQueryValue'
import {toIntOrNull, getPageCount} from '@/helpers/utils'
import BlocksTable, {COLUMNS_MAP} from '../PagedBlocks/BlocksTable'
import {getPageAndBoundaryFromCursor} from '../PagedBlocks/util'
import {useIsMobile} from '@/components/hooks/useBreakpoints'
import config from '@/config'

const useStyles = makeStyles((theme) => ({
  wrapper: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
      justifyContent: 'center',
    },
  },
  heading: {
    marginTop: theme.spacing(3),
    [theme.breakpoints.down('sm')]: {
      marginBottom: theme.spacing(3),
    },
  },
  bottomPagination: {
    marginTop: theme.spacing(3),
  },
  paginationWrapper: {
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: 'auto',
    },
  },
}))

const messages = defineMessages({
  blocks: ' {count} {count, plural, =0 {Blocks} one {Block} other {Blocks}}',
})

const useLoadData = (cursor, epochNumber) => {
  const {error, loading, data} = useQueryNotBugged(GET_PAGED_BLOCKS_IN_EPOCH, {
    variables: {cursor, epochNumber},
    notifyOnNetworkStatusChange: true,
  })

  return {
    loading,
    error,
    data: data.pagedBlocksInEpoch || {},
  }
}

const {SLOT, TIME, SLOT_LEADER, TRANSACTIONS, TOTAL_SENT, FEES, SIZE} = COLUMNS_MAP
const columns = [SLOT, TIME, SLOT_LEADER, TRANSACTIONS, TOTAL_SENT, FEES, SIZE]

const PAGE_SIZE = 10
const rowsPerPage = PAGE_SIZE

// Note(ppershing): This handler is quite complicated bacause of the way
// we want to smoothly deal with pagination when both switching pages
// and switching epochs
const useEpochBlockData = (epochNumber) => {
  const [page, setPage] = useManageQueryValue('page', null, toIntOrNull)
  const [cache, setCache] = useState({
    // Note: we have to start with current epochNumber and dummy loading state
    // so that this handles page reload correctly
    epochNumber,
    loading: true,
    error: null,
    blocks: [],
    totalCount: 0,
    nextPageCursor: null,
    effectivePage: 0,
  })

  const pageToLoad = page == null || cache.epochNumber !== epochNumber ? null : page
  // Note(ppershing): this overfetches on the last page.
  // We might need to cap this to `Math.min(pageToLoad * rowsPerPage, cache.totalCount)`
  // to have valid cursor (right now the backend does not complain though).
  // However, capping would be trouble on itself as it would lag displaying new content
  // by 1 load (first get new total count, only following request would not be capped)
  // Note that this is only about an explicit selection of the last page,
  // e.g. user paginating to previous page and then back
  const cursorToLoad = pageToLoad == null ? null : pageToLoad * rowsPerPage
  const {data, loading, error} = useLoadData(cursorToLoad, epochNumber)

  const getEffectivePage = (page, totalCount) =>
    page != null ? page : getPageCount(totalCount, rowsPerPage)

  // Note: this could be wrong if currently loading
  const newData = {
    epochNumber, // keep for cache
    loading,
    error,
    blocks: data.blocks,
    totalCount: Math.max(data.totalCount, epochNumber === cache.epochNumber ? cache.totalCount : 0),
    nextPageCursor: data.cursor,
    effectivePage: getEffectivePage(pageToLoad, data.totalCount),
  }

  useEffect(() => {
    if (loading) return

    assert(_.isEqual(Object.keys(cache), Object.keys(newData)))

    if (!_.isEqual(cache, newData)) setCache(newData)
  }, [loading, cache, newData])

  useEffect(() => {
    if (page !== pageToLoad) {
      // synchronize page back to URL
      setPage(pageToLoad)
    }
  })

  return loading
    ? {
      ...cache,
      effectivePage:
          // If we changed page manually, we want to see it immediatelly on the screen
          // but if it was changed automatically, we need to wait to avoid double-changes
          cache.epochNumber === epochNumber
            ? getEffectivePage(page, cache.totalCount)
            : cache.effectivePage,
      setPage,
    }
    : {
      ...newData,
      setPage,
    }
}

const Blocks = ({blocksCount, epochNumber}) => {
  const classes = useStyles()
  const {translate: tr, formatInt} = useI18n()
  const isMobile = useIsMobile()

  const {
    totalCount,
    effectivePage,
    setPage,
    nextPageCursor,
    loading,
    error,
    blocks,
  } = useEpochBlockData(epochNumber)

  const pagination = (
    <Pagination
      pageCount={getPageCount(totalCount, rowsPerPage)}
      page={effectivePage}
      onChangePage={setPage}
      reverseDirection
    />
  )

  const {nextPageNumber, pageBoundary} = getPageAndBoundaryFromCursor(nextPageCursor, rowsPerPage)

  return (
    <Grid container direction="column">
      {!config.showStakingData && (
        <Grid item className={classes.heading}>
          <Grid container justify="center">
            <EntityHeading>{tr(messages.blocks, {count: formatInt(blocksCount)})}</EntityHeading>
          </Grid>
        </Grid>
      )}
      <Grid item>
        <Grid container className={classes.wrapper}>
          <Grid item className={classes.paginationWrapper}>
            {isMobile && !config.showStakingData && <MobilePaginationDivider />}
            {pagination}
          </Grid>
        </Grid>
      </Grid>
      <BlocksTable {...{blocks, columns, loading, error, nextPageNumber, pageBoundary}} />
      {blocks && (
        <Hidden mdUp>
          <Grid item className={classes.bottomPagination}>
            {pagination}
          </Grid>
        </Hidden>
      )}
    </Grid>
  )
}

export default Blocks
