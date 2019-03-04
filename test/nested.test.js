const Routing = require('./../lib/routing');
const assert = require('assert');

const options = {
    routes: {
        host: 'http://google.com',

        persons: {
            host: 'http://bing.com',
            path: '/persons',

            findById: {
                host: 'http://yahoo.com',
                path: '/{id}',

                getName: {
                    path: '/name/{name}',

                    getSecondLetter: {
                        path: '/secondLetter'
                    }
                }
            },

            findEverywhere: {
                path: '/everywhere'
            }
        },

        notPersons: {
            path: '/notPersons',

            findById: {
                host: 'http://yahoo.com',
                path: '/{id}',

                getName: {
                    path: '/name/{name}',

                    getSecondLetter: {
                        path: '/secondLetter'
                    },

                    testDoubleSlashes: {
                        host: 'http:///yahoo.com/',
                        path: '/doubleSlash'
                    }
                }
            },

            findAny: {
                path: '/any'
            }
        }
    }
}

const routing = new Routing(options);

describe('Nested', function () {

    describe('Class', function () {
        it('should be defined', function () {
            assert.ok(Routing);
        });

        it('should generate correct path from shrinked target', function () {
            assert.equal(
                routing.getRoute('persons.getSecondLetter'),
                'http://yahoo.com/persons/{id}/name/{name}/secondLetter'
            );
        });

        it('should generate correct from a different source than the first one', function () {
            assert.equal(
                routing.getRoute('notPersons.getSecondLetter'),
                'http://yahoo.com/notPersons/{id}/name/{name}/secondLetter'
            );
        });

        it('should not keep the path preceding its definition in cache', function () {
            assert.equal(
                routing.getRoute('persons.findEverywhere'),
                'http://bing.com/persons/everywhere'
            );
        });

        it('should fix any `/` non-occurences', function () {
            assert.equal(
                routing.getRoute('notPersons.testDoubleSlashes'),
                'http://yahoo.com/notPersons/{id}/name/{name}/doubleSlash'
            );
        })
    });
});