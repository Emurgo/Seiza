import moment from 'moment'

const facadeMarketHistory = (data: any) => ({
  timePeriod: {
    open: moment.unix(data.time),
    // TODO: does not hold for the last value!
    close: moment.unix(data.time + 86400),
  },
  price: {
    open: data.open,
    close: data.close,
    low: data.low,
    high: data.high,
  },
})

const fetchMarketHistory = async ({pricingAPI}, currency) => {
  const limit = 20 // TODO: Support start & end timestamps
  const rawResult = await pricingAPI.get('histoday', {
    fsym: 'ADA',
    tsym: currency,
    limit,
  })

  return {
    data: rawResult.Data.map(facadeMarketHistory),
  }
}

export default {
  Query: {
    marketHistory: (root, args, context) => fetchMarketHistory(context, args.currency),
  },
}
