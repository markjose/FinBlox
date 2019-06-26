const sortOrdersByPrice = descending => ({ price: priceA }, { price: priceB }) => (priceA < priceB) ^ descending;

module.exports = orders => {

  const structured = {};
  orders
    .filter(({ price }) => price && price > 0)
    .forEach(({ direction, price = 0, size, orderId }) => {
      if (!structured[direction]) structured[direction] = {};

      if (!structured[direction][price]) {
        structured[direction][price] = {
          volume: 0,
          orderIds: []
        };
      }

      const { volume, orderIds } = structured[direction][price];

      structured[direction][price] = {
        volume: volume + size,
        orderIds: orderIds.concat([orderId])
      };
    });

  const { buy, sell } = structured;

  const mapPricedOrders = (orderObj = {}, isDescending = false) => Object
    .entries(orderObj)
    .map(([price, { volume, orderIds }]) => ({
      price: Number.parseFloat(price),
      volume,
      orderCount: orderIds.length
    }))
    .sort(sortOrdersByPrice(isDescending));

  return {
    ask: mapPricedOrders(sell, true),
    bid: mapPricedOrders(buy, false)
  };
};
