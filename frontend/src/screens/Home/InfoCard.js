// @flow
import * as React from 'react'

import {KeyValueCard, LoadingOverlay, ErrorOverlay, Overlay} from '@/components/visual'

type Field = {|
  label: string,
  getValue: Function,
|}

type InfoCardProps = {|
  data: Object, // TODO: get graphql type
  fields: Array<Field>,
  cardLabel: string,
  cardValue: string,
  loading: boolean,
  error: any,
  icon?: any,
|}

const InfoCard = ({data, fields, cardLabel, cardValue, loading, error, icon}: InfoCardProps) => {
  const items = fields.map((fieldDesc) => ({
    label: fieldDesc.label,
    value: data && fieldDesc.getValue(data),
  }))

  return (
    <Overlay.Wrapper className="h-100">
      <KeyValueCard
        className="h-100"
        header={<KeyValueCard.Header label={cardLabel} value={cardValue} icon={icon} />}
      >
        <KeyValueCard.Body items={items} />
        <LoadingOverlay loading={loading} />
        <ErrorOverlay error={!loading && error} />
      </KeyValueCard>
    </Overlay.Wrapper>
  )
}

export default InfoCard
