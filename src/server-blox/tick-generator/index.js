const random = require('random');
const { DateTime } = require('luxon');
const { getMidPrice } = require('../../utils/price');

const defaultVolume = 1234;

function* tickGenerator(options) {
  const {
    initialValue = 1, // Starting value
    minFrequency = 1, // Minimum number of ticks per second
    maxFrequency = 10, // Maximum number of ticks per second
    decimalPlaces = 3, // Number of decimal places for a full tick
    maxTicks = 10, // Maximum number of ticks to increment
    standardDeviation = 5, // The standard deviation when using normal distribution
    allowHalfTicks = true, // Allow half ticks
    minSpread = 1, // The minimum spread between ask and bid prices
    maxSpread = 3, // The maximum spread between ask and bid prices
    useLinearDistribution = false, // Normal distribution will be used unless this is true
    onTick = () => null
  } = options;

  let currentValue = initialValue;
  let currentValueTime = DateTime.utc().toMillis();

  const getTickPeriod = () => {
    const maxPeriod = 1 / minFrequency;
    const minPeriod = 1 / maxFrequency;
    return random.float(maxPeriod - minPeriod) * 1000;
  };

  const getIncrement = () => {
    const multiplier = Math.pow(10, decimalPlaces);
    const randomValue = useLinearDistribution
      ? random.int(-maxTicks, maxTicks)
      : random.normal(0, standardDeviation)();
    const shouldHalf = allowHalfTicks && random.boolean();

    return (randomValue + (shouldHalf ? 0.5 : 0)) / multiplier;
  };

  const getSpread = () => {
    const multiplier = Math.pow(10, decimalPlaces);
    const randomValue = useLinearDistribution
      ? random.int(minSpread, maxSpread)
      : random.normal(0, minSpread, maxSpread)() + minSpread;
    const shouldHalf = allowHalfTicks && random.boolean();

    return (randomValue + (shouldHalf ? 0.5 : 0)) / multiplier;
  };

  const formatValue = val => parseFloat((val > 0 ? val : 0)
    .toFixed(allowHalfTicks ? decimalPlaces + 1 : decimalPlaces));

  while (true) {
    const nextValueTime = currentValueTime + getTickPeriod();
    do {
      yield null;
    } while (DateTime.utc().toMillis() < nextValueTime);
    currentValueTime = nextValueTime;

    const val = currentValue += getIncrement();
    const ask = formatValue(val + getSpread());
    const bid = formatValue(val);

    yield onTick({
      time: DateTime.utc().toISO(),
      ask,
      bid,
      bidVolume: defaultVolume,
      askVolume: defaultVolume,
      mid: getMidPrice(ask, bid)
    });
  }
}

module.exports = options => {
  const { name = 'New Tick Generator' } = options;
  const generator = tickGenerator(options);

  console.log(`Created tick-generator '${name}'`);
  return {
    name,
    execute: opCount => generator.next(opCount)
  };
};
