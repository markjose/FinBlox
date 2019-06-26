const createSecurityMaster = require('../server-blox/security-master');

const exampleSecurityMaster = createSecurityMaster({
  name: 'Example Security Master',
  onErrors: console.log
});

exampleSecurityMaster.create({
  securityId: 'bar',
  name: 'Bar',
  tickSize: 0.1
});

exampleSecurityMaster.create({
  securityId: 'faa:bar',
  name: 'Faa Bar',
  tickSize: 0.01
});

exampleSecurityMaster.create({
  securityId: 'foo:bar',
  name: 'Foo Bar',
  tickSize: 0.001,
  allowHalfTicks: true
});

exampleSecurityMaster.create({
  securityId: 'foo:baz',
  name: 'Foo Baz',
  tickSize: 0.0001
});

console.log(exampleSecurityMaster.list());
console.log(exampleSecurityMaster.search('baz'));
