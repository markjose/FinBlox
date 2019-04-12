const createServer = require('../server-blox');
const createTicker = require('../server-blox/ticker');
const createOhlc = require('../server-blox/ohlc');

const oneMinuteOhlc = createOhlc({
  name: 'Example OHLC One Minute',
  unit: 'minutes',
  period: 1,
  onOpen: async ohlc => console.log('OPEN', ohlc),
  onClose: async ohlc => console.log('CLOSE', ohlc)
})

const eurGbpTicker = createTicker({
  name: 'Example Ticker EURGBP',
  initialValue: 1,
  onTick: async val => await oneMinuteOhlc.tick('EURGBP', val)
});

const exampleServer = createServer({
  name: 'Example Blox Server'
});

exampleServer.add(eurGbpTicker);
exampleServer.run();
