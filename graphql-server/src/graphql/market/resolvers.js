// @flow
import moment from "moment";

const facadeMarketHistory = (data: any) => ({
  timePeriod: {
    open: moment.unix(data.time),
    // TODO: does not hold for the last value!
    close: moment.unix(data.time + 86400)
  },
  price: {
    open: data.open,
    close: data.close,
    low: data.low,
    high: data.high
  }
});

const fetchMarketHistory = async ({ pricingAPI }, currency) => {
  const limit = 365; // TODO: Support start & end timestamps
  const rawResult = await pricingAPI.get("histoday", {
    fsym: "ADA",
    tsym: currency,
    limit
  });

  return {
    data: rawResult.Data.map(facadeMarketHistory)
  };
};

const dailyAvgCache = {};

const getDailyAvgCacheKey = (date, currency) => `${date}--${currency}`;

const fetchAverageDailyPrice = async ({ pricingAPI }, currency, timestamp) => {
  const startOfDay = Math.floor(moment(timestamp).unix() / 86400) * 86400;

  const notOlderThanDay = startOfDay > moment().unix() - 86400;

  if (notOlderThanDay) {
    // return current price
    return await pricingAPI
      .get("price", {
        fsym: "ADA",
        tsyms: currency
      })
      .then(res => res[currency]);
  }

  const cacheKey = getDailyAvgCacheKey(startOfDay, currency);

  // return cached value
  if (dailyAvgCache[cacheKey]) {
    return dailyAvgCache[cacheKey];
  }

  // run history request
  dailyAvgCache[cacheKey] = await pricingAPI
    .get("dayAvg", {
      fsym: "ADA",
      tsym: currency,
      toTs: startOfDay
    })
    .then(res => res[currency]);

  return dailyAvgCache[cacheKey];
};

export default {
  Query: {
    marketHistory: (root: any, args: any, context: any) =>
      fetchMarketHistory(context, args.currency),
    averageDailyPrice: (root: any, args: any, context: any) =>
      fetchAverageDailyPrice(context, args.currency, args.timestamp)
  }
};
