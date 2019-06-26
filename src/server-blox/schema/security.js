module.exports = {
  id: '@finblox/security',
  type: 'object',
  properties: {
    securityId: { type: 'string' },
    name: { type: 'string' },
    tickSize: { type: 'number' },
    allowHalfTicks: { type: 'boolean' }
  },
  required: ['securityId', 'name', 'tickSize']
};