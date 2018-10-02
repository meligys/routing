const Routing = require('./../lib/routing');

test('that missing protocol in route definition returns error', () => {

    let options = {
        routes: {
            host: 'http://google.com',

            persons: {
                host: 'http://bing.com',
                path: '/persons',

                findAll: {
                    host: 'yahoo.com/',
                    path: '/all'
                }
            }
        }
    }

    let routing = new Routing(options);
    expect(function(){routing.generate('persons.findAll');}).toThrow(new Error('Route definition must have a protocol'));
});

test('that missing route definition returns an error', () => {

    let options = {
        routes: {
            host: 'http://google.com',

            persons: {
                host: 'http://bing.com',
                path: '/persons',

                findAll: {
                    host: 'yahoo.com/',
                    path: '/all'
                }
            }
        }
    }

    let routing = new Routing(options);
    expect(function(){routing.generate('persons.findByMyself');}).toThrow(new Error('No route defined with the following parameters: persons.findByMyself'));
});

test('that missing method returns an error', () => {

    let options = {
        routes: {
            host: 'http://google.com',

            persons: {
                host: 'http://bing.com',
                path: '/persons',

                findAll: {
                    host: 'ftp://yahoo.com/',
                    path: '/all'
                }
            }
        }
    }

    let routing = new Routing(options);
    expect(function(){routing.generate('persons');}).toThrow(new Error('Both a resource and method must be specified'));
});
