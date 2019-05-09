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

// greater-than
const gt = (field: string, value: any) => ({
  range: {
    [field]: {
      gt: value,
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

const some = (conditions: Array<any>): any => ({
  bool: {
    should: conditions.filter((c) => !!c),
    minimum_should_match: 1,
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
  _nest: (defs: any) => ({
    encode: () => ({
      filter: {
        match_all: {},
      },
      aggs: agg._encode(defs),
    }),
    decode: (x: any) => agg._decode(defs, x),
  }),
  sumAda: (field: string) =>
    agg._nest({
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
  countNull: (field: string) => ({
    encode: () => ({missing: {field}}),
    // Grr, elastic is just plain weird. Every other aggregation is .value
    decode: (x: any) => x.doc_count,
  }),
  // Note(ppershing): Precision is some opaque value with maximum 40000
  // This guarantees generally <1% error
  // For details see
  // eslint-disable-next-line max-len
  // https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-metrics-cardinality-aggregation.html#_counts_are_approximate
  countDistinctApprox: (field: string, precision: number = 40000) => ({
    encode: () => ({
      cardinality: {
        field,
        // Note: in case you need to include nulls in the result
        // add "missing: 'default value'" property
        precision_threshold: precision,
      },
    }),
    decode: (x: any) => x.value,
  }),
}

export class Query {
  _type: string
  _filter: Array<any>
  _sort: Array<any>

  constructor(type: string, _filter: Array<any> = [], _sort: Array<any> = []) {
    this._type = type
    this._filter = _filter
    this._sort = _sort
  }

  filter = (condition: any) => {
    return new Query(this._type, [...this._filter, condition], this._sort)
  }

  sortBy = (field: string, order: SortDirection) => {
    return new Query(this._type, this._filter, [...this._sort, [field, order]])
  }

  get _query(): any {
    return {
      bool: {
        filter: this._filter.filter((c) => !!c),
      },
    }
  }
}

const q = (type: string) => new Query(type)

const e = {
  agg,
  orderBy,
  notNull,
  isNull,
  lte,
  lt,
  gte,
  gt,
  eq,
  some,
  all: filter,
  matchPhrase,
  onlyActiveFork,
  filter,
  q,
}

export type E = typeof e

export default e
