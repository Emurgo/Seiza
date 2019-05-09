import CostAnalysis from 'graphql-cost-analysis/dist/costAnalysis'
import * as graphql from 'graphql'

// we extend multipliers not to support only fields (e.g., "pageSize")
// but also direct numbers in cases we have explicit internal page size

// An example: @cost(multipliers[10, "pageSize", "start"])
// will produce multiplier 10 * pageSize * start
// TODO(ppershing): maybe add some fixed cost to string arguments as well to have
// 10 * (pageSize + fixedCost) * (start + fixedCost) to account
// for complexity when these arguments are zero
class ImprovedCostAnalysis extends CostAnalysis {
  // Mimicks https://github.com/pa-bru/graphql-cost-analysis/blob/master/src/costAnalysis.js
  getMultipliersFromListNode(listNode, fieldArgs) {
    const multipliers = []
    const direct = [] // this are new integer multipliers
    listNode.forEach((node) => {
      if (node.kind === graphql.Kind.STRING) {
        multipliers.push(node.value)
      } else if (node.kind === graphql.Kind.INT) {
        direct.push(node.value)
      }
    })

    return [...direct, ...this.getMultipliersFromString(multipliers, fieldArgs)]
  }
}

export default ImprovedCostAnalysis
