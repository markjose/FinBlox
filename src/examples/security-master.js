const createSecurityMaster = require('../server-blox/security-master');

const exampleSecurityMaster = createSecurityMaster({
  name: 'Example Security Master',
  onErrors: console.log
});

exampleSecurityMaster.newSecurity({
  securityId: 'foo:bar',
  name: 'Foo Bar'
});

console.log(exampleSecurityMaster.listSecurities());
