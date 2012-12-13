var nest = require('../lib/nest-thermostat.js');

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

exports.nest = {
  setUp: function(done) {
    done();
  },
  'no args': function(test) {
    test.expect(2);

    test.ok(nest.init, 'should be exposed.');
    test.ok(nest.getInfo, 'should be exposed.');
    
    test.done();
  }
};