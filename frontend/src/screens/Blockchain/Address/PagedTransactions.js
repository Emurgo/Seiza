// @flow

import React from 'react'
import {Link} from 'react-router-dom'
import {compose} from 'redux'
import {withStateHandlers, withProps} from 'recompose'
import {Card} from '@material-ui/core'

import {routeTo} from '@/helpers/routes'
import Pagination, {getPageCount} from '@/components/visual/Pagination'

const ROWS_PER_PARGE = 3

const PagedTransactions = ({currentTransactions, totalCount, onChangePage, rowsPerPage, page}) => (
  <React.Fragment>
    <Pagination
      count={totalCount}
      rowsPerPage={rowsPerPage}
      page={page}
      onChangePage={onChangePage}
    />
    {currentTransactions.map((tx) => (
      <Card style={{height: '300px'}} key={tx.txHash}>
        <Link to={routeTo.transaction(tx.txHash)}>{tx.txHash}</Link>
      </Card>
    ))}
  </React.Fragment>
)

export default compose(
  withProps((props) => {
    const totalCount = props.transactions.length
    const pageCount = getPageCount(totalCount, ROWS_PER_PARGE)
    return {totalCount, pageCount, rowsPerPage: ROWS_PER_PARGE}
  }),
  withStateHandlers(
    {page: 0},
    {
      onChangePage: () => (page) => ({page}),
    }
  ),
  withProps(({page, totalCount, pageCount, transactions, rowsPerPage}) => {
    const from = page * rowsPerPage
    return {
      currentTransactions: transactions.slice(from, from + rowsPerPage),
    }
  })
)(PagedTransactions)
