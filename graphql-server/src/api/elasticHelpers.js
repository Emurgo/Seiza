// @flow

export type SortDirection = 'asc' | 'desc'

const orderBy = (fields: Array<[string, SortDirection]>): any =>
  fields.map(([field, order]) => ({
    [field]: {order},
  }))

const notNull = (field: string) => ({
  exists: {
    field,
  },
})

const isNull = (field: string) => ({
  bool: {
    must_not: {
      exists: {
        field,
      },
    },
  },
})

// Use for hash search -- seems to be case-insensitive exact match
// for them
const matchPhrase = (field: string, phrase: string) => ({
  match_phrase: {
    [field]: phrase,
  },
})

// less-than-or-equal
const lte = (field: string, value: any) => ({
  range: {
    [field]: {
      lte: value,
    },
  },
})

// less-than
const lt = (field: string, value: any) => ({
  range: {
    [field]: {
      lt: value,
    },
  },
})

// greater-than-or-equal
const gte = (field: string, value: any) => ({
  range: {
    [field]: {
      gte: value,
    },
  },
})

// equal or exact match
const eq = (field: string, value: any) => ({
  term: {
    [field]: value,
  },
})

// Seiza-specific
const onlyActiveFork = () => ({
  term: {
    branch: 0,
  },
})

const filter = (conditions: Array<any>): any => ({
  bool: {
    filter: conditions.filter((c) => !!c),
  },
})

// Aggregations

const sum = (field: string) => ({
  sum: {
    field,
  },
})

const sumAda = (field: string) => ({
  [`${field}.integers`]: {
    sum: {
      field: `${field}.integers`,
    },
  },
  [`${field}.decimals`]: {
    sum: {
      field: `${field}.decimals`,
    },
  },
  [`${field}.full`]: {
    sum: {
      field: `${field}.full`,
    },
  },
})

const extractSumAda = (agg: any, prefix: string) => {
  return {
    integers: agg[`${prefix}.integers`].value,
    decimals: agg[`${prefix}.decimals`].value,
    full: agg[`${prefix}.full`].value,
  }
}

const e = {
  orderBy,
  notNull,
  isNull,
  lte,
  lt,
  gte,
  eq,
  matchPhrase,
  onlyActiveFork,
  filter,
  sum,
  sumAda,
  extractSumAda,
}

export type E = typeof e

export default e
