var assert = require('assert');

describe('Basic Mocha String Testddd', function() {
    it('should return number of charachters in a string', function() {
        assert.strictEqual("Hello".length, 5);
    });
    it('should return first charachter of the string', function() {
        assert.strictEqual("Hello".charAt(0), 'H');
    });
});