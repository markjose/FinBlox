const { DateTime } = require('luxon');
const validate = require('jsonschema').validate;
const { getMidPrice } = require('../../utils/price');

const orderSchema = require('../schema/order');
const bookBuilder = require('./bookBuilder');

let nextOrderId = 1;

const generateOrderId = () => nextOrderId++;

module.exports = options => {
  const {
    name = 'New Order Book', // The name of the block
    securityId,
    getOrderId = generateOrderId,
    onErrors = () => null,
    onTick = () => null
  } = options;

  if (!securityId || securityId.length < 1) return onErrors([
    `The book requires a valid security ID (${securityId})`
  ]);

  let book;
  const orders = [];

  const validateOrder = (order, onComplete = () => null) => {
    const { errors } = validate(order, orderSchema);

    onComplete(errors.length ? errors.map(({ schema, stack }) => `${schema}: ${stack}`) : null);
  };

  const addOrder = order => {
    if (order.securityId !== securityId) return onErrors([
      `The order security ID (${order.securityId}) is not the same as the book security ID (${securityId})`
    ]);

    order.orderId = getOrderId(order);
    order.created = DateTime.utc().toISO();

    if (!orders) orders = [];
    orders.push(order);
    book = bookBuilder(orders);

    onTick(getBook(1));
  };

  const getBook = depth => {
    const { ask, bid, time } = book;

    const rows = [];
    const rowCount = Math.max(ask.length, bid.length);
    const takeRows = depth ? Math.min(rowCount, depth) : rowCount;

    for (let i = 0; i < takeRows; i++) {
      rows.push({
        time,
        ask: ask[i] && ask[i].price,
        askVolume: ask[i] && ask[i].volume,
        bid: bid[i] && bid[i].price,
        bidVolume: bid[i] && bid[i].volume,
        mid: getMidPrice(ask[i], bid[i])
      });
    }

    return rows;
  };

  const newOrder = order => validateOrder(order, errors => errors ? onErrors(errors) : addOrder(order));
  const allOrders = () => orders;

  console.log(`Created order-book '${name}'`);
  return { name, newOrder, allOrders, getBook };
};
