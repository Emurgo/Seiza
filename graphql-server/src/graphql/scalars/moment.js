// https://gist.github.com/rijvirajib/2f4dbd808185e73d69ed2bfae759b51b
import moment from 'moment'
import {GraphQLScalarType, GraphQLError, Kind} from 'graphql'

module.exports = new GraphQLScalarType({
  name: 'Date',
  /**
   * Serialize date value into string
   * @param  {moment} value date value
   * @return {String} date as string
   */
  serialize(value) {
    const date = moment(value)
    if (!date.isValid()) {
      throw new GraphQLError('Field serialize error: value is an invalid Date')
    }
    return date.toISOString()
  },
  /**
   * Parse value into date
   * @param  {*} value serialized date value
   * @return {moment} date value
   */
  parseValue(value) {
    const date = moment(value)
    if (!date.isValid()) {
      throw new GraphQLError('Field parse error: value is an invalid Date')
    }
    return date
  },
  /**
   * Parse ast literal to date
   * @param  {Object} ast graphql ast
   * @return {moment} date value
   */
  parseLiteral(ast) {
    if (ast.kind !== Kind.STRING) {
      throw new GraphQLError(`Query error: Can only parse strings to date but got: ${ast.kind}`)
    }
    const date = moment(ast.value)
    if (!date.isValid()) {
      throw new GraphQLError('Query error: Invalid date')
    }
    return date
  },
})
