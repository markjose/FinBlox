# OHLC Aggregator

The OHLC Aggregator will take any Tick stream and aggregate the prices from that stream given a time period. When a ime period expires the aggreagator will emit it's own tick with the aggregated values.

Generators and aggregators need a Server Blox server in order to function. The Server Blox server allows 'generator' functions to be registered and orchestrates the output. For more information you should read about the [FinBlox server](server-blox/).

## Creation
The OHLC aggregator factory is exported from the module. The factory function takes one parameter called which are the creation options, summarised in the table below.

```javascript
const createOhlcAggregator = require('@FinBlox/server-blox/ohlc-aggregator');

const oneMinuteOhlc = createOhlcAggregator({
  name: 'Example OHLC Aggregator',
  unit: 'seconds',
  period: 60,
  onOpen: async ohlc => console.log('OPEN', ohlc),
  onClose: async ohlc => console.log('CLOSE', ohlc)
});
```

#### Options

| **Property** | **Required** | **Description**                                             | **Default value**   |
| ------------ | ------------ | ----------------------------------------------------------- | ------------------- |
| name         | No           | The name of this instance of the block                      | New OHLC Aggregator |
| unit         | No           | The unit which the period is specified in                   | minutes             |
| period       | No           | The aggregation period in 'unit' units for ticks            | 5                   |
| onOpen       | No           | A function which is called when a new OHLC period is opened | () => null          |
| onClose      | No           | A function which is called when a new OHLC period is closed | () => null          |


## Example
The below implementation creates a tick generator and a OHLC aggregator and then pipes the output from the tick generator in to the aggregator. The aggregator outputs a tick with an OHLC set of values every time an period has expired and a tick happens.

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
});

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