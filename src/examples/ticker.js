const createServer = require('../server-blox');
const createTicker = require('../server-blox/ticker');

const usdGbpTicker = createTicker({
  name: 'Example Ticker USDGBP',
  onTick: async val => console.log({ ...val, symbol: 'USDGBP' })
});

const eurGbpTicker = createTicker({
  name: 'Example Ticker EURGBP',
  initialValue: 10,
  onTick: async val => console.log({ ...val, symbol: 'EURGBP' })
});

const exampleServer = createServer({
  name: 'Example Blox Server'
});

exampleServer.add(usdGbpTicker);
exampleServer.add(eurGbpTicker);
exampleServer.run();
