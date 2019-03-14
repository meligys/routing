const Routing = require('./../lib/routing');
const assert = require('assert');

const options = {
    routes: {
        host: 'http://google.com',

        persons: {
            host: 'http://bing.com',
            path: '/persons',

            findAll: {
                path: '/all'
            },

            findAny: {
                host: 'http://yahoo.com',
                path: '/any'
            },

            findById: {
                host: 'http://yahoo.com',
                path: '/{id}'
            },

            findByIdAndContinue: {
                host: 'http://yahoo.com',
                path: '/{id}/continue'
            },


            findByIdAndNameGlued: {
                host: 'http://yahoo.com',
                path: '/{id}/{name}'
            },

            findByIdAndName: {
                host: 'http://yahoo.com',
                path: '/{id}/name/{name}'
            }
        },

        notPersons: {
            path: '/notPersons',

            findAll: {
                path: '/all'
            },

            testDoubleSlashes: {
                host: 'http:///yahoo.com/',
                path: '/doubleSlash'
            }
        }
    }
}
const routing = new Routing(options);

describe('Routing', function () {

    describe('Class', function () {
        it('should be defined', function () {
            assert.ok(Routing);
        });

        it('should generate path using resource path and method path', function () {
            assert.equal(
                routing.generate('notPersons.findAll'),
                'http://google.com/notPersons/all');
        });

        it('should use resource host if defined', function () {
            assert.equal(
                routing.generate('persons.findAll'),
                'http://bing.com/persons/all')
        });

        it('should use method host', function () {
            assert.equal(
                routing.generate('persons.findAny'),
                'http://yahoo.com/persons/any')
        });

        it('should transform a parameter into its value', function () {
            assert.equal(
                routing.generate('persons.findById', { params: { id: 'a25f4b6d5' } }),
                'http://yahoo.com/persons/a25f4b6d5');
        });

        it('should not cut the path when transforming a parameter into its value', function () {
            assert.equal(
                routing.generate('persons.findByIdAndContinue', { params: { id: 'a25f4b6d5' } }),
                'http://yahoo.com/persons/a25f4b6d5/continue');
        });

        it('should transform multiple parameters to their value', function () {
            assert.equal(
                routing.generate('persons.findByIdAndNameGlued', { params: { id: 'a25f4b6d5', name: 'john' } }),
                'http://yahoo.com/persons/a25f4b6d5/john');
        });
        it('should not cut path when transforming multiple parameters to their value', function () {
            assert.equal(
                routing.generate('persons.findByIdAndName', { params: { id: 'a25f4b6d5', name: 'john' } }),
                'http://yahoo.com/persons/a25f4b6d5/name/john');
        });
        it('should remove `//` except for the protocol', function () {
            assert.equal(
                routing.generate('notPersons.testDoubleSlashes'),
                'http://yahoo.com/notPersons/doubleSlash'
            );
        })
        it('should ignore host when precised', function () {
            assert.equal(
                routing.generate('persons.findById', { ignoreHost: true, params: { id: 'a25f4b6d5' } }),
                '/persons/a25f4b6d5');
        });
        it('no error on ignore host on no `/` character path', function () {
            assert.equal(
                routing.generate('persons', { ignoreHost: true, params: { id: 'a25f4b6d5' } }),
                '/persons');
        });
    });
});