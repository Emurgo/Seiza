// @flow

import React from 'react'
import {Link} from 'react-router-dom'
import {compose} from 'redux'
import {withStateHandlers, withProps} from 'recompose'

import {routeTo} from '../../helpers/routes'
import PaginatedTable, {getPageCount} from '../../components/visual/PaginatedTable'

const PagedTransactions = ({currentTransactions, totalCount, onChangePage, rowsPerPage, page}) => {
  const bodyData = currentTransactions.map((tx) => ([
    <div style={{height: '300px'}} key={tx.txHash}>
      <Link to={routeTo.transaction(tx.txHash)}>
        {tx.txHash}
      </Link>,
      <span>tx.totalInput</span>,
      <span>tx.totalOutput</span>,
    </div>,
  ]))

  const headerData = ['hash']

  return (<PaginatedTable
    rowsPerPage={rowsPerPage}
    page={page}
    totalCount={totalCount}
    onChangePage={onChangePage}
    rowsPerPageOptions={[rowsPerPage]}
    bodyData={bodyData}
    headerData={headerData}
    hideHead
    disableRowStyles
  />)
}

export default compose(
  withProps((props) => {
    const totalCount = props.transactions.length
    const pageCount = getPageCount(totalCount, props.rowsPerPage)
    return {totalCount, pageCount}
  }),
  withStateHandlers(
    (props) => ({page: getPageCount(props.totalCount, props.rowsPerPage) - 1}),
    {
      onChangePage: () => (page) => ({page}),
    }
  ),
  withProps(({page, totalCount, pageCount, transactions, rowsPerPage}) => {
    // TODO: do we want same behavior for as for 'blocks' or do we want to query from first page?
    // (for now staying consistent with 'blocks')
    const from = page === pageCount - 1
      ? 0
      : totalCount - (rowsPerPage * page) - rowsPerPage

    return {
      currentTransactions: transactions.slice(from, from + rowsPerPage),
      totalCount,
    }
  }),
)(PagedTransactions)
