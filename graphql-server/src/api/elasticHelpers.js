// @flow
import _ from 'lodash'

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

const encodeAggs = (aggs: any) => _.mapValues(aggs, (x) => x.encode())

const decodeAggs = (aggs: any, value: any) => _.mapValues(aggs, (x, key) => x.decode(value[key]))

const agg = {
  _decode: decodeAggs,
  _encode: encodeAggs,
  sum: (field: string) => ({
    encode: () => ({
      sum: {
        field,
      },
    }),
    decode: (x: any) => x.value,
  }),
  // This is a hack to create nested keys in
  // aggregation results
  // as elastic cannot be easily convinced
  // otherwise
  nest: (defs: any) => ({
    encode: () => ({
      filter: {
        match_all: {},
      },
      aggs: agg._encode(defs),
    }),
    decode: (x: any) => agg._decode(defs, x),
  }),
  sumAda: (field: string) =>
    agg.nest({
      integers: agg.sum(`${field}.integers`),
      decimals: agg.sum(`${field}.decimals`),
      full: agg.sum(`${field}.full`),
    }),
  max: (field: string) => ({
    encode: () => ({
      max: {
        field,
      },
    }),
    decode: (x: any) => x.value,
  }),
  raw: (rawDef: any) => ({
    encode: () => rawDef,
    decode: (x: any) => x,
  }),
  count: (field: string) => ({
    encode: () => ({
      value_count: {
        field,
      },
    }),
    decode: (x: any) => x.value,
  }),
  // TODO(ppershing): how does this behave
  // for repeated fields?
  countNotNull: (field: string) => ({
    encode: () => ({value_count: {field}}),
    decode: (x: any) => x.value,
  }),
}

const e = {
  agg,
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
}

export type E = typeof e

export default e
