// @flow
import React, {useRef, useState} from 'react'
import {defineMessages} from 'react-intl'

import {ExpansionPanel, EntityCardContent, Link} from '@/components/visual'
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

const useExpandHandler = () => {
  const ref = useRef(null)
  const [expanded, setExpanded] = useState(false)
  const onClickExpand = useCutClickableArea(ref, () => setExpanded((expanded) => !expanded))
  return [expanded, ref, onClickExpand]
}
const TransactionCard = ({txHash, children}: ExternalProps) => {
  const [expanded, ref, onClickExpand] = useExpandHandler()
  const {translate: tr} = useI18n()
  return (
    <ExpansionPanel
      expanded={expanded}
      onChange={onClickExpand}
      summary={
        <EntityCardContent
          label={tr(messages.transactionId)}
          innerRef={ref}
          value={<Link to={routeTo.transaction(txHash)}>{txHash}</Link>}
          rawValue={txHash}
        />
      }
    >
      {children}
    </ExpansionPanel>
  )
}

export default TransactionCard
