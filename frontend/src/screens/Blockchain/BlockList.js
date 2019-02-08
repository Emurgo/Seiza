// @flow

import React from 'react'
import {graphql} from 'react-apollo'
import {compose} from 'redux'
import {withHandlers} from 'recompose'
import {injectIntl, defineMessages} from 'react-intl'

import {GET_BLOCKS} from '../../api/queries'

// TODO: styles

const messages = defineMessages({
  loadMore: {
    id: 'blockchain.blockList.loadMore',
    defaultMessage: 'Load more',
  },
})

const withBlocks = graphql(GET_BLOCKS, {
  name: 'blocks',
  options: ({after}) => ({
    variables: {after},
  }),
})

// TODO: use some HOC to alter props names?
// Note: 'fetchMore' is built-in apollo function
const BlockList = (props) => {
  const {loading, blocks} = props.blocks
  const {
    intl: {formatMessage},
  } = props
  const {onLoadMore} = props
  return (
    <React.Fragment>
      {!loading && blocks.blocks.map((block) => <div key={block.blockHash}>{block.blockHash}</div>)}
      {!loading && <button onClick={onLoadMore}>{formatMessage(messages.loadMore)}</button>}
    </React.Fragment>
  )
}

export default compose(
  injectIntl,
  withBlocks,
  withHandlers({
    onLoadMore: (props) => () => {
      const {blocks, fetchMore} = props.blocks
      fetchMore({
        variables: {
          after: blocks.cursor,
        },
        updateQuery: (prev, {fetchMoreResult, ...rest}) => {
          if (!fetchMoreResult) return prev
          return {
            ...fetchMoreResult,
            blocks: {
              ...fetchMoreResult.blocks,
              blocks: [...prev.blocks.blocks, ...fetchMoreResult.blocks.blocks],
            },
          }
        },
      })
    },
  })
)(BlockList)
