const createServer = require('../server-blox');
const createTickGenerator = require('../server-blox/tick-generator');
const createWeightedAggregator = require('../server-blox/weighted-aggregator');

const weightedAggregator = createWeightedAggregator({
  name: 'Example Weighted Aggregator',
  weights: {
    'source-name-1': 0.8,
    'source-name-2': 0.1,
    'source-name-3': 0.1
  },
  onNewPrice: async weightedPrice => console.log('NEW PRICE', weightedPrice)
})

const tickerSource1 = createTickGenerator({
  name: 'Example Ticker Source 1',
  initialValue: 1,
  onTick: async val => await weightedAggregator.tick('SYMBOL', val, 'source-name-1')
});

const tickerSource2 = createTickGenerator({
  name: 'Example Ticker Source 2',
  initialValue: 1,
  onTick: async val => await weightedAggregator.tick('SYMBOL', val, 'source-name-2')
});

const tickerSource3 = createTickGenerator({
  name: 'Example Ticker Source 3',
  initialValue: 2,
  onTick: async val => await weightedAggregator.tick('SYMBOL', val, 'source-name-3')
});

const exampleServer = createServer({
  name: 'Example Blox Server'
});

exampleServer.add(tickerSource1);
exampleServer.add(tickerSource2);
exampleServer.add(tickerSource3);
exampleServer.run();
