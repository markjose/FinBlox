# @FinBlox

## A collection of useful financial "Blox" used to quickly mock financial systems

### ohlc-aggregator

This block will aggregate a price feed input to give a Open, High, Low, Close output for the given time period.

```javascript
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
```

### order-book

This block provides a simple order book which will presere order state and output the book at the requested depth.

### tick-generator

This will generate a seeded random price flow given a start value using linear of normalised distributions.

### weighted-aggregator

This block will aggregate multiple price feed inputs to give a weighted average output based on the passed options.
