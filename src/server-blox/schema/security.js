module.exports = {
  id: '@finblox/security',
  type: 'object',
  properties: {
    securityId: { type: 'string' },
    name: { type: 'string' }
  },
  required: ['securityId', 'name']
};