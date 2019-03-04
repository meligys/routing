const Routing = require('./../lib/routing');
const assert = require('assert');

const options = {
    routes: {
        host: 'http://google.com',

        persons: {
            host: 'http://bing.com',
            path: '/persons',

            findAll: {
                host: 'yahoo.com',
                path: '/all'
            }
        }
    }
}
const routing = new Routing(options);

describe('Errors', function () {
    describe('Checks', function () {
        it('should return error when protocol is missing', function () {
            assert.throws(
                function () { routing.generate('persons.findAll') },
                Error,
                new Error('Route definition must have a protocol')
            );
        });

        it('should return error on missing route definition', function () {
            assert.throws(
                function () { routing.generate('persons.findAny') },
                Error,
                new Error('No route defined with the following parameters: persons.findAny')
            );
        });
    });
});