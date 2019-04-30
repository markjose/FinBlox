const { DateTime } = require('luxon');

module.exports = options => {
  const {
    name = 'New Weighted Aggregator', // The name of the block
    weights = {},
    onNewPrice = () => null
  } = options;

  const weightedPrices = {};

  const createWeightedPrice = () => Object.keys(weights)
    .reduce((acc, key) => ({
      ...acc,
      [key]: null
    }), {});

  const updateWeightedPrice = (key, val, source) => ({
    ...weightedPrices[key],
    [source]: val
  });

  const hasCompletePrice = key => !Object.values(weightedPrices[key]).find(val => val === null);
  const calculateWeightedPrice = key => Object.keys(weights).reduce((acc, source) => (weights[source] * (weightedPrices[key][source] || 0)) + acc, 0);

  const format = key => ({
    key,
    raw: weightedPrices[key],
    time: DateTime.utc().toISO(),
    value: calculateWeightedPrice(key)
  });

  const tick = async (key, { value }, source) => {
    createWeightedPrice(key);

    weightedPrices[key] = updateWeightedPrice(key, value, source);

    if (hasCompletePrice(key)) {
      await onNewPrice(format(key));
    }
  };

  console.log(`Created weighted-aggregator '${name}'`);
  return { name, tick };
};
