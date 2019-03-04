const Cache = require('../lib/cache');
const fs = require('fs');
const assert = require('assert')

const testJson = {
    persons: 'persons',
    'persons.findById': 'persons.findById',
    'persons.name': 'persons.findById.name',
    'persons.findAll': 'persons.findAll',
    notPersons: 'notPersons',
    'notPersons.findById': 'notPersons.findById',
    'notPersons.name': 'notPersons.findById.name',
    'notPersons.findAll': 'persons.findAll'
};

describe('Cache', function () {

    describe('Class', function () {
        it('should be defined', function () {
            assert.ok(Cache);
        });

        it('should create and remove cache at default location', function () {

            const cache = new Cache();
            assert.equal(fs.existsSync('./cache.dat'), true);
            cache.remove();
            assert.equal(fs.existsSync('./cache.dat'), false);
        });

        it('should be able to write and regenerate a json', function () {

            const cache = new Cache('/tmp/cache0.dat');
            assert.equal(fs.existsSync('/tmp/cache0.dat'), true);
            cache.write(testJson);
            //empty cache in memory to check load function
            cache.cache = {};
            cache.load()
            assert.deepEqual(cache.cache, testJson);
            cache.remove();
        });

        it('should allow information retrieval', function () {
            const cache = new Cache('/tmp/cache1.dat');
            assert.equal(fs.existsSync('/tmp/cache1.dat'), true);
            cache.write(testJson);
            assert.equal(cache.get('persons.name'), 'persons.findById.name');
        });

        it('should throw error on target length =/= 2', function () {
            const cache = new Cache('/tmp/cache2.dat');
            assert.equal(fs.existsSync('/tmp/cache2.dat'), true);
            cache.write(testJson);
            assert.throws(
                function () { cache.get('persons.findAll.anotherTargetEntry') },
                Error,
                new Error(`Target should only be of size 2, is of size 3 : persons,findAll,anotherTargetEntry`)
            );
            cache.remove();
        });
    });
});