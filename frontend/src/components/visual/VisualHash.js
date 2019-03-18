// @flow
import React from 'react'
import jdenticon from 'jdenticon'
import {dangerouslyEmbedIntoDataURI} from '@/helpers/url'

type Props = {|
  +value: string,
  +size: number,
|}

const dataURI = ({value, size}: Props) =>
  dangerouslyEmbedIntoDataURI('image/svg+xml', jdenticon.toSvg(value, size))

const Icon = ({value, size}: Props) => (
  <img alt="" width={size} height={size} src={dataURI({value, size})} />
)

Icon.dataURI = dataURI

export default Icon
