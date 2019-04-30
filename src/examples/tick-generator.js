const createServer = require('../server-blox');
const createTickGenerator = require('../server-blox/tick-generator');

const usdGbpTicker = createTickGenerator({
  name: 'Example Ticker USDGBP',
  onTick: async val => console.log({ ...val, symbol: 'USDGBP' })
});

const eurGbpTicker = createTickGenerator({
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
