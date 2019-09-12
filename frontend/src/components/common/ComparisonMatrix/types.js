// @flow

// TODO: move more commmon types here

export type CategoryConfigType = Array<{|
  i18nLabel: Object,
  getValue?: (Object, Object) => any,
  render?: (Object, Object) => any,
  height?: number,
|}>

export type ComparisonMatrixProps = {|
  title: string,
  data: Array<{name: string}>,
  categoryConfigs: Array<{
    config: CategoryConfigType,
    categoryLabel?: string,
  }>,
  getIdentifier: (Object) => string,
  expandedColumnsStorageKey: string,
|}
