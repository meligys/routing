const Routing = require('./../lib/routing');
const assert = require('assert');

const options = {
    routes: {
        host: 'http://google.com',

        persons: {
            host: 'http://bing.com',
            path: '/persons',

            findAll: {
                host: 'ftp://yahoo.com/',
                path: '/all'
            },

            findAny: {
                host: 'yahoo.com/',
                path: 'all'
            }
        }
    }
}
const routing = new Routing(options);

describe('Errors', function () {

    describe('Missing protocol in route definition', function () {
        it('should return a route definition error', function () {
            assert.throws(
                function () { routing.generate('persons.findAny'); },
                Error,
                new Error('Route definition must have a protocol')
            );
        });
    });

    describe('Missing route definition', function () {
        it('should return a missing route error that precises which call fails', function () {
            assert.throws(
                function () { routing.generate('persons.findByMyself'); },
                Error,
                new Error('No route defined with the following parameters: persons.findByMyself')
            );
        });
    });

    describe('Missing method', function () {
        it('should return a missing resource or method error', function () {
            assert.throws(
                function () { routing.generate('persons'); },
                Error,
                new Error('Both a resource and method must be specified')
            );
        });
    });
});