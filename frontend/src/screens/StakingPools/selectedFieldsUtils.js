// @flow
import {useMemo, useState, useCallback} from 'react'
import {defineMessages} from 'react-intl'

import {useI18n} from '@/i18n/helpers'

import {fieldsConfig} from './fieldsConfig'

const messages = defineMessages({
  showAll: 'Show all',
  fieldsCount: 'Show {count, plural, =0 {# columns} one {# column} other {# columns}}',
})

const defaultFieldsValues = fieldsConfig.map<string>(({field}) => field)

export const useSelectedFieldsProps = () => {
  const {translate: tr} = useI18n()
  const selectOptions = useMemo(
    () =>
      fieldsConfig.map<{label: string, value: string}>((conf) => ({
        label: conf.getLabel({tr}),
        value: conf.field,
      })),
    [tr]
  )

  // TODO: store in cookie that is set only for `staking-pools` url
  const [selectedFields, setSelectedFields] = useState(defaultFieldsValues)

  const onSelectedFieldsChange = useCallback((e: any) => setSelectedFields(e.target.value), [
    setSelectedFields,
  ])

  const renderSelectValue = useCallback(
    (selected: Array<string>) => {
      return selected.length === selectOptions.length
        ? tr(messages.showAll)
        : tr(messages.fieldsCount, {count: selected.length})
    },
    [selectOptions.length, tr]
  )

  return {selectedFields, onSelectedFieldsChange, selectOptions, renderSelectValue}
}
