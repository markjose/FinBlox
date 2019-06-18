module.exports = {
  id: '@finblox/order',
  type: 'object',
  properties: {
    requestingPartyId: { type: 'string' },
    securityId: { type: 'string' },
    size: { type: 'integer', minimum: 1 },
    direction: { type: 'string', enum: ['buy', 'sell'] },
    price: { type: 'number' }
  },
  required: ['requestingPartyId', 'securityId', 'size', 'direction']
};