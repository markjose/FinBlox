const { DateTime } = require('luxon');

module.exports = options => {
  const {
    name = 'New OHLC Block', // The name of the block
    unit = 'hours', // The unit which the period is specified in
    period = 1, // The aggregation period in 'unit' units for ticks
    onOpen = () => null,
    onClose = () => null
  } = options;

  const ohlcs = {};

  const createOhlc = (now, open) => {
    const openTime = now.startOf(unit);

    return {
      openTime,
      closeTime: openTime.plus({ [unit]: period }),
      open,
      close: open,
      high: open,
      low: open
    };
  };

  const updateOhlc = (ohlc, val) => ({
    ...ohlc,
    close: val,
    high: val > ohlc.high ? val : ohlc.high,
    low: val < ohlc.low ? val : ohlc.low
  });

  const format = (key, ohlc) => ({
    ...ohlc,
    key,
    openTime: ohlc.openTime.toISO(),
    closeTime: ohlc.closeTime.toISO()
  });

  const tick = async (key, { time, value }) => {
    const now = DateTime.fromISO(time);

    if (!ohlcs[key] || now > ohlcs[key].closeTime) {
      if (ohlcs[key]) {
        await onClose(format(key, ohlcs[key]));
      }
      ohlcs[key] = createOhlc(now, ohlcs[key] ? ohlcs[key].close : value);
      await onOpen(format(key, ohlcs[key]));
    }

    ohlcs[key] = updateOhlc(ohlcs[key], value);
  };

  console.log(`Created ohlc '${name}'`);
  return { name, tick };
};
