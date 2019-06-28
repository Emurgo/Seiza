// @flow
import React from 'react'
import {EntityCardContent, VisualHash, ContentSpacing} from '@/components/visual'

type Props = {
  name: string,
  hash: string,
}

const PoolEntityContent = ({name, hash}: Props) => {
  return (
    <ContentSpacing bottom={0.75} top={0.75}>
      <EntityCardContent
        iconRenderer={<VisualHash value={hash} size={48} />}
        label={name}
        value={hash}
        showCopyIcon={false}
      />
    </ContentSpacing>
  )
}

export default PoolEntityContent
