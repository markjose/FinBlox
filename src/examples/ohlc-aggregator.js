const createServer = require('../server-blox');
const createTickGenerator = require('../server-blox/tick-generator');
const createOhlcAggregator = require('../server-blox/ohlc-aggregator');

const oneMinuteOhlc = createOhlcAggregator({
  name: 'Example OHLC Aggregator',
  unit: 'seconds',
  period: 5,
  onOpen: async ohlc => console.log('OPEN', ohlc),
  onClose: async ohlc => console.log('CLOSE', ohlc)
})

const eurGbpTicker = createTickGenerator({
  name: 'Example Ticker EURGBP',
  initialValue: 1,
  onTick: async ({ time, ask, bid }) => {
    await oneMinuteOhlc.tick('EURGBP_ask', { time, value: ask });
    await oneMinuteOhlc.tick('EURGBP_bid', { time, value: bid });
  }
});

const exampleServer = createServer({
  name: 'Example Blox Server'
});

exampleServer.add(eurGbpTicker);
exampleServer.run();
