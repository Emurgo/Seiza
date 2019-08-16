// @flow
import {useMemo, useCallback} from 'react'
import {defineMessages} from 'react-intl'

import {useI18n} from '@/i18n/helpers'
import {useManageQueryValue} from '@/components/hooks/useManageQueryValue'

import {nonTitleFieldsConfig} from './fieldsConfig'

const messages = defineMessages({
  showAll: 'Show all',
  fieldsCount: 'Show {count, plural, =0 {# columns} one {# column} other {# columns}}',
})

const defaultFieldsValues = nonTitleFieldsConfig.map<string>(({field}) => field)

// Note: not using ',' as browser encodes it using % that we wish to get rid of
// Make sure we do not use '_' inside field names
const QUERY_DIVIDER = '_'

const decode = (str) => str.split(QUERY_DIVIDER)
const encode = (arr) => arr.join(QUERY_DIVIDER)

export const useSelectedFieldsProps = () => {
  const {translate: tr} = useI18n()
  const selectOptions = useMemo(
    () =>
      nonTitleFieldsConfig.map<{label: string, value: string}>((conf) => ({
        label: conf.getLabel({tr}),
        value: conf.field,
      })),
    [tr]
  )

  const [selectedFields, setSelectedFields] = useManageQueryValue(
    'fields',
    encode(defaultFieldsValues),
    decode
  )

  const onSelectedFieldsChange = useCallback(
    (e: any) => {
      const newSelectedFieldsValue = encode(e.target.value)
      // Note: at least one field must be selected
      newSelectedFieldsValue && setSelectedFields(newSelectedFieldsValue)
    },
    [setSelectedFields]
  )

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
