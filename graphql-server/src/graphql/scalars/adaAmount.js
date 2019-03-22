// @flow
import BigNumber from 'bignumber.js'
import {GraphQLScalarType, GraphQLError, Kind} from 'graphql'

export default new GraphQLScalarType({
  name: 'AdaAmount',

  serialize(value) {
    value = this.parseValue(value)

    return value.toFixed()
  },

  parseValue(value) {
    const parsed = new BigNumber(value, 10)
    if (parsed.isNaN()) {
      throw new GraphQLError('Field parse error: value is invalid AdaAmount')
    }

    if (parsed.decimalPlaces() > 0) {
      // $FlowFixMe mixed->string coercion not allowed?
      throw new GraphQLError(`Field parse error: value ${value} is invalid AdaAmount`)
    }

    return parsed
  },

  parseLiteral(ast) {
    if (ast.kind !== Kind.STRING || ast.kind !== Kind.INT) {
      throw new GraphQLError(
        `Query error: Can only parse strings or integers to date but got: ${ast.kind}`
      )
    }
    return this.parseValue(ast.value)
  },
})
