const { DateTime } = require('luxon');

function* tickGenerator(options) {
  const {
    initialValue = 1, // Starting value
    minFrequency = 1, // Minimum number of ticks per second
    maxFrequency = 10, // Maximum number of ticks per second
    decimalPlaces = 3, // Number of decimal places for a full tick
    maxTicks = 10, // Maximum number of ticks to increment
    allowHalfTicks = true, // Allow half ticks
    useLinearDistribution = false, // Normal distribution will be used unless this is true
    onTick = () => null
  } = options;

  let currentValue = initialValue;
  let currentValueTime = DateTime.utc().toMillis();

  const getTickPeriod = () => {
    const maxPeriod = 1 / minFrequency;
    const minPeriod = 1 / maxFrequency;
    return Math.random() * (maxPeriod - minPeriod) * 1000 + minPeriod;
  };

  const getLinearIncrement = () => {
    const multiplier = Math.pow(10, decimalPlaces);
    const randomValue = Math.floor((Math.random() - 0.5) * 2 * maxTicks);
    const shouldHalf = allowHalfTicks && (Math.random() >= 0.5);

    return (randomValue + (shouldHalf ? 0.5 : 0)) / multiplier;
  };

  const getNormalIncrement = () => {
    return getLinearIncrement();
  };

  while (true) {
    const nextValueTime = currentValueTime + getTickPeriod();
    do {
      yield null;
    } while (DateTime.utc().toMillis() < nextValueTime);
    currentValueTime = nextValueTime;

    const increment = useLinearDistribution
      ? getLinearIncrement()
      : getNormalIncrement();

    const val = currentValue += increment;
    yield onTick({
      time: DateTime.utc().toISO(),
      value: parseFloat((val > 0 ? val : 0).toFixed(allowHalfTicks ? decimalPlaces + 1 : decimalPlaces))
    });
  }
}

module.exports = options => {
  const { name = 'New Ticker Block' } = options;
  const generator = tickGenerator(options);

  console.log(`Created ticker '${name}'`);
  return {
    name,
    execute: opCount => generator.next(opCount)
  };
};
