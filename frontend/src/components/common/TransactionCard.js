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

const TransactionCard = ({txHash, children}: ExternalProps) => {
  const entityRef = useRef(null)
  const [expanded, setExpanded] = useState(false)
  const onChange = useCutClickableArea(entityRef, () => setExpanded((expanded) => !expanded))
  const {translate: tr} = useI18n()
  return (
    <ExpansionPanel
      expanded={expanded}
      onChange={onChange}
      summary={
        <EntityCardContent
          label={tr(messages.transactionId)}
          innerRef={entityRef}
          value={<Link to={routeTo.transaction(txHash)}>{txHash}</Link>}
        />
      }
    >
      {children}
    </ExpansionPanel>
  )
}

export default TransactionCard
