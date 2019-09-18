// @flow
import React, {useRef, useState} from 'react'
import {defineMessages} from 'react-intl'
import {makeStyles} from '@material-ui/styles'

import {ExpansionPanel} from '@/components/visual'
import {EntityCardContent, Link, EntityEllipsize} from '@/components/common'
import {useI18n} from '@/i18n/helpers'
import {routeTo} from '@/helpers/routes'
import useCutClickableArea from '@/components/hooks/useCutClickableArea'

const messages = defineMessages({
  transactionId: 'Transacton Id:',
})

type ExternalProps = {|
  txHash: string,
  children: React$Node,
|}

const useStyles = makeStyles((theme) => ({
  hash: {
    maxWidth: '35vw',
    overflow: 'hidden',
    display: 'block',
    textOverflow: 'ellipsis',
    [theme.breakpoints.up('sm')]: {
      maxWidth: '60vw',
    },
    [theme.breakpoints.up('md')]: {
      maxWidth: '80vw',
    },
  },
}))

const useExpandHandler = () => {
  const ref = useRef(null)
  const [expanded, setExpanded] = useState(false)
  const onClickExpand = useCutClickableArea(ref, () => setExpanded((expanded) => !expanded))
  return [expanded, ref, onClickExpand]
}
const TransactionCard = ({txHash, children}: ExternalProps) => {
  const [expanded, ref, onClickExpand] = useExpandHandler()
  const classes = useStyles()
  const {translate: tr} = useI18n()
  return (
    <ExpansionPanel
      expanded={expanded}
      onChange={onClickExpand}
      summary={
        <EntityCardContent
          label={tr(messages.transactionId)}
          innerRef={ref}
          /* Note: using span with maxWidth and ellisize is hack, as for some
            reason wrapping inside EntityCardId does not work correctly from this component.
            Not using `Typography` as it results in `<p> cannot appear as <p> descendant warning`
          */
          value={
            <span className={classes.hash}>
              <Link to={routeTo.transaction(txHash)}>
                <EntityEllipsize value={txHash} />
              </Link>
            </span>
          }
          rawValue={txHash}
          ellipsizeValue={false}
        />
      }
    >
      {children}
    </ExpansionPanel>
  )
}

export default TransactionCard
