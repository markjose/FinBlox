const { DateTime } = require('luxon');
const validate = require('jsonschema').validate;

const securitySchema = require('../schema/security');

module.exports = options => {
  const {
    name = 'New Security Master' // The name of the block
  } = options;

  const securities = {};

  const validateSecuirty = (security, onComplete = () => null) => {
    const { errors } = validate(security, securitySchema);

    onComplete(errors.length ? errors.map(({ schema, stack }) => `${schema}: ${stack}`) : null);
  };

  const addSecurity = security => {
    const { securityId } = security;

    securities[securityId] = security;
    securities[securityId].lastUpdate = DateTime.utc().toISO();
  };

  const newSecurity = security => validateSecuirty(security, errors => errors ? onErrors(errors) : addSecurity(security));
  const listSecurities = () => Object.values(securities);

  console.log(`Created security-master '${name}'`);
  return { name, newSecurity, listSecurities };
};
