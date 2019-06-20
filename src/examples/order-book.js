const createOrderBook = require('../server-blox/order-book');

const exampleOrderBook = createOrderBook({
  securityId: 'foo:bar',
  name: 'Example Order Book',
  onErrors: console.log
});

exampleOrderBook.newOrder({ requestingPartyId: 'me', securityId: 'foo:bar', size: 1000, direction: 'buy' });
exampleOrderBook.newOrder({ requestingPartyId: 'them1', securityId: 'foo:bar', size: 1010, direction: 'buy', price: 1.1 });
exampleOrderBook.newOrder({ requestingPartyId: 'them2', securityId: 'foo:bar', size: 1010, direction: 'buy', price: 1.1 });
exampleOrderBook.newOrder({ requestingPartyId: 'them1', securityId: 'foo:bar', size: 1200, direction: 'buy', price: 1.2 });
exampleOrderBook.newOrder({ requestingPartyId: 'me', securityId: 'foo:bar', size: 900, direction: 'buy', price: 1.3 });
exampleOrderBook.newOrder({ requestingPartyId: 'me', securityId: 'foo:bar', size: 950, direction: 'buy', price: 1.4 });

exampleOrderBook.newOrder({ requestingPartyId: 'me', securityId: 'foo:bar', size: 2000, direction: 'sell', price: 1.305 });
exampleOrderBook.newOrder({ requestingPartyId: 'them1', securityId: 'foo:bar', size: 2200, direction: 'sell', price: 1.225 });
exampleOrderBook.newOrder({ requestingPartyId: 'me', securityId: 'foo:bar', size: 1080, direction: 'sell', price: 1.131 });

exampleOrderBook.newOrder({
  requestingPartyId: 'me',
  securityId: 'bar:foo',
  size: 1500,
  direction: 'sell'
});

console.log(exampleOrderBook.getBook());
console.log(exampleOrderBook.getBook(1));
