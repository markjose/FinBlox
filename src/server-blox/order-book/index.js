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

    return onComplete(errors.length ? errors.map(({ schema, stack }) => `${schema}: ${stack}`) : null);
  };

  const addOrder = order => {
    if (order.securityId !== securityId) return onErrors([
      `The order security ID (${order.securityId}) is not the same as the book security ID (${securityId})`
    ]);

    order.orderId = getOrderId(order);
    order.updateable = true;
    order.created = DateTime.utc().toISO();

    if (!orders) orders = [];
    orders.push(order);

    book = bookBuilder(orders);
    onTick(getBook(1));

    return order;
  };

  const updateOrder = (orderId, { size, price }) => {
    const updateable = { size, price };
    const now = DateTime.utc().toISO();

    let order = orders.find(order => order.orderId === orderId);
    if (!order) return onErrors([
      `The order ID (${orderId}) was not found`
    ]);

    if (!order.updateable) return onErrors([
      `The order ID (${orderId}) is locked and cannot be updated`
    ]);

    order.history = Object.assign(order.history || [], {
      time: now,
      size: { from: order.size, to: size },
      price: { from: order.price, to: order.price }
    });
    order.modified = now;
    order = Object.assign(order, updateable);

    book = bookBuilder(orders);
    onTick(getBook(1));
  };

  const getBook = depth => {
    const { ask, bid } = book;

    const rows = [];
    const rowCount = Math.max(ask.length, bid.length);
    const takeRows = depth ? Math.min(rowCount, depth) : rowCount;

    for (let i = 0; i < takeRows; i++) {
      rows.push({
        ask: ask[i] && ask[i].price,
        askVolume: ask[i] && ask[i].volume,
        bid: bid[i] && bid[i].price,
        bidVolume: bid[i] && bid[i].volume,
        mid: getMidPrice(ask[i], bid[i])
      });
    }

    return {
      securityId,
      time: DateTime.utc().toISO(),
      rows
    };
  };

  const createOrder = order => validateOrder(order, errors => errors ? onErrors(errors) : addOrder(order));

  const listOrders = () => orders;

  console.log(`Created order-book '${name}'`);
  return {
    name,
    createOrder,
    updateOrder,
    listOrders,
    getBook
  };
};
