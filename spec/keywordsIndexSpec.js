var sinon = require('sinon')
require('coffee-script/register');

browser = sinon.fake();
browser.params = {}

var testx = require('..');

var el = sinon.fake();
var wt = sinon.fake();
wt.then = sinon.fake.returns('Fri Nov 09 2018 10:31:59 GMT+0100 (W. Europe Standard Time)');
el.wait = sinon.fake.returns(wt);
testx.element = sinon.fake.returns(el);

var keyWords = require('../keywords/index');

var checkAlmostEquals = keyWords.get()['check time almost equals'];

describe("When >>check time almost equals<<,", function() {
    it('should tolerate one second difference.', function()
    {
        checkAlmostEquals({"dt": 'Fri Nov 09 2018 10:31:58 GMT+0100 (W. Europe Standard Time)', "seconds to tolerate": 2}, {'_meta': 'whatever'});
    });
    it('should work for the exact equal times.', function()
    {
        checkAlmostEquals({"dt": 'Fri Nov 09 2018 10:31:59 GMT+0100 (W. Europe Standard Time)', "seconds to tolerate": 2}, {'_meta': 'whatever'});
    });
    it('should THROW when "seconds to tolerate" is not defined.', function()
    {
        checkAlmostEquals({"dt": 'Fri Nov 09 2018 10:31:58 GMT+0100 (W. Europe Standard Time)'}, {'_meta': 'whatever'});
        // Error: The element 'seconds to tolerate' has to be defined in 'check time almost equals'.
    });
    it('should FAIL to tolerate four seconds difference.', function()
    {
        checkAlmostEquals({"dt": 'Fri Nov 09 2018 10:31:55 GMT+0100 (W. Europe Standard Time)', "seconds to tolerate": 3}, {'_meta': 'whatever'});
        // Expected "Fri Nov 09 2018 10:31:59 GMT+0100 (W. Europe Standard Time)" not to differ from "Fri Nov 09 2018 10:31:55 GMT+0100 (W. Europe Standard Time)" for more than 3 seconds, but it differs for 4.
    });
    it('should tolerate two seconds difference, with affected minutes.', function()
    {
        checkAlmostEquals({"dt": 'Fri Nov 09 2018 10:32:01 GMT+0100 (W. Europe Standard Time)', "seconds to tolerate": 3}, {'_meta': 'whatever'});
    });
    it('should FAIL to tolerate a difference of one minute.', function()
    {
        checkAlmostEquals({"dt": 'Fri Nov 09 2018 10:32:59 GMT+0100 (W. Europe Standard Time)', "seconds to tolerate": 3}, {'_meta': 'whatever'});
        // Expected "Fri Nov 09 2018 10:31:59 GMT+0100 (W. Europe Standard Time)" not to differ from "Fri Nov 09 2018 10:32:59 GMT+0100 (W. Europe Standard Time)" for more than 3 seconds, but it differs for 60.
    });
    it('should THROW if the time format is incorrect.', function()
    {
        checkAlmostEquals({"dt": 'Fri Nov 09 2018 10:31:x7 GMT+0100 (W. Europe Standard Time)', "seconds to tolerate": 3}, {'_meta': 'whatever'});
        // Error: Incorrect time format.
    });
});