const { DateTime } = require('luxon');
const validate = require('jsonschema').validate;

const orderSchema = require('../schema/order');
const bookBuilder = require('./bookBuilder');

const emptyBook = { bid: [], ask: [] };

let nextOrderId = 1;

const generateOrderId = () => nextOrderId++;
const getMidPrice = (lower, upper) => lower && upper && (lower.price + ((upper.price - lower.price) / 2.0));

module.exports = options => {
  const {
    name = 'New Order Book', // The name of the block
    getOrderId = generateOrderId,
    onErrors = () => null,
    onChanged = () => null
  } = options;

  const orders = {};
  const books = {};

  const validateOrder = (order, onComplete = () => null) => {
    const { errors } = validate(order, orderSchema);

    onComplete(errors.length ? errors.map(({ schema, stack }) => `${schema}: ${stack}`) : null);
  };

  const addOrder = order => {
    const { securityId } = order;

    order.orderId = getOrderId(order);
    order.created = DateTime.utc().toISO();

    if (!orders[securityId]) orders[securityId] = [];
    orders[securityId].push(order);

    if (!books[securityId]) books[securityId] = emptyBook;
    books[securityId] = bookBuilder(orders[securityId]);

    onChanged({
      orders: orders[securityId],
      books: books[securityId]
    });
  };

  const getBook = (securityId, depth) => {
    const { ask, bid } = books[securityId];

    const rows = [];
    const rowCount = Math.max(ask.length, bid.length);
    const takeRows = depth ? Math.min(rowCount, depth) : rowCount;

    for (let i = 0; i < takeRows; i++) {
      rows.push({
        askPrice: ask[i] && ask[i].price,
        askVolume: ask[i] && ask[i].volume,
        bidPrice: bid[i] && bid[i].price,
        bidVolume: bid[i] && bid[i].volume,
        midPrice: getMidPrice(ask[i], bid[i])
      });
    }

    return rows;
  };

  const newOrder = order => validateOrder(order, errors => errors ? onErrors(errors) : addOrder(order));
  const allOrders = () => orders;

  console.log(`Created order-book '${name}'`);
  return { name, newOrder, allOrders, getBook };
};
