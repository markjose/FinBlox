const { DateTime } = require('luxon');
const validate = require('jsonschema').validate;

const securitySchema = require('../schema/security');

module.exports = options => {
  const {
    name = 'New Security Master', // The name of the block
    onErrors = () => null
  } = options;

  const securities = {};

  const validateSecuirty = (security, onComplete = () => null) => {
    const { errors } = validate(security, securitySchema);

    onComplete(errors.length ? errors.map(({ schema, stack }) => `${schema}: ${stack}`) : null);
  };

  const addSecurity = security => {
    const { securityId: rawSecurityId } = security;

    if (!rawSecurityId || rawSecurityId.length < 1) return onErrors([
      `The security requires a valid security ID (${rawSecurityId})`
    ]);

    const now = DateTime.utc().toISO();
    const securityId = rawSecurityId.toUpperCase();
    const [exchangeIdOrSymbol, symbol] = securityId.split(':');

    const defaults = {
      allowHalfTicks: false
    };

    const newSecurity = Object.assign(defaults, security, {
      securityId,
      lastUpdate: now,
      exchangeId: symbol && exchangeIdOrSymbol,
      symbol: symbol || exchangeIdOrSymbol
    });

    securities[securityId] = newSecurity;
  };

  const create = security => validateSecuirty(security, errors => errors ? onErrors(errors) : addSecurity(security));

  const list = () => Object.values(securities);

  const search = freeText => list()
    .filter(({ exchangeId, symbol }) =>
      (exchangeId && exchangeId.indexOf(freeText.toUpperCase()) === 0) ||
      (symbol && symbol.indexOf(freeText.toUpperCase()) === 0)
    );

  console.log(`Created security-master '${name}'`);
  return {
    name,
    create,
    list,
    search
  };
};
