const createOrderBook = require('../server-blox/order-book');

const exampleOrderBook = createOrderBook({
  securityId: 'foo:bar',
  name: 'Example Order Book',
  onErrors: console.log
});

exampleOrderBook.createOrder({ requestingPartyId: 'me', securityId: 'foo:bar', size: 1000, direction: 'buy' });
exampleOrderBook.createOrder({ requestingPartyId: 'them1', securityId: 'foo:bar', size: 1010, direction: 'buy', price: 1.1 });
exampleOrderBook.createOrder({ requestingPartyId: 'them2', securityId: 'foo:bar', size: 1010, direction: 'buy', price: 1.1 });
exampleOrderBook.createOrder({ requestingPartyId: 'them1', securityId: 'foo:bar', size: 1200, direction: 'buy', price: 1.2 });
exampleOrderBook.createOrder({ requestingPartyId: 'me', securityId: 'foo:bar', size: 900, direction: 'buy', price: 1.3 });
exampleOrderBook.createOrder({ requestingPartyId: 'me', securityId: 'foo:bar', size: 950, direction: 'buy', price: 1.4 });

exampleOrderBook.createOrder({ requestingPartyId: 'me', securityId: 'foo:bar', size: 2000, direction: 'sell', price: 1.305 });
exampleOrderBook.createOrder({ requestingPartyId: 'them1', securityId: 'foo:bar', size: 2200, direction: 'sell', price: 1.225 });

const { orderId } = exampleOrderBook.createOrder({ requestingPartyId: 'me', securityId: 'foo:bar', size: 1080, direction: 'sell', price: 1.131 });

exampleOrderBook.updateOrder(orderId, {
  size: 1600,
  price: 1.4
});

exampleOrderBook.createOrder({
  requestingPartyId: 'me',
  securityId: 'bar:foo',
  size: 1500,
  direction: 'sell'
});

console.log(exampleOrderBook.getBook());
