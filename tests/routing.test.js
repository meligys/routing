const Routing = require('./../lib/routing');

test('that routing is instance of class', () => {
    expect(Routing).toBeDefined();
  });

test('that routing generates path using resource path and method path', () => {

    let options = {
        routes: {
            host: 'http://google.com',

            persons: {
                path: '/persons',

                findAll: {
                    path: '/all'
                }
            }
        }
    }

    let routing = new Routing(options);
    expect(routing.generate('persons.findAll')).toBe('http://google.com/persons/all');
});

test('that routing uses resource host', () => {

    let options = {
        routes: {
            host: 'http://google.com',

            persons: {
                host: 'http://bing.com',
                path: '/persons',

                findAll: {
                    path: '/all'
                }
            }
        }
    }

    let routing = new Routing(options);
    expect(routing.generate('persons.findAll')).toBe('http://bing.com/persons/all');
});

test('that routing uses method host', () => {

    let options = {
        routes: {
            host: 'http://google.com',

            persons: {
                host: 'http://bing.com',
                path: '/persons',

                findAll: {
                    host: 'http://yahoo.com',
                    path: '/all'
                }
            }
        }
    }

    let routing = new Routing(options);
    expect(routing.generate('persons.findAll')).toBe('http://yahoo.com/persons/all');
});

test('that routing transforms id parameter into value', () => {

    let options = {
        routes: {
            host: 'http://google.com',

            persons: {
                host: 'http://bing.com',
                path: '/persons',

                findById: {
                    host: 'http://yahoo.com',
                    path: '/{id}'
                }
            }
        }
    }

    let routing = new Routing(options);
    expect(routing.generate('persons.findById', {id: 'a25f4b6d5'})).toBe('http://yahoo.com/persons/a25f4b6d5');
});

test('that routing transforms id parameter into value and not cutting path', () => {

    let options = {
        routes: {
            host: 'http://google.com',

            persons: {
                host: 'http://bing.com',
                path: '/persons',

                findById: {
                    host: 'http://yahoo.com',
                    path: '/{id}/continuePath'
                }
            }
        }
    }

    let routing = new Routing(options);
    expect(routing.generate('persons.findById', {id: 'a25f4b6d5'})).toBe('http://yahoo.com/persons/a25f4b6d5/continuePath');
});


test('that routing transforms two parameters into values', () => {

    let options = {
        routes: {
            host: 'http://google.com',

            persons: {
                host: 'http://bing.com',
                path: '/persons',

                findByIdAndName: {
                    host: 'http://yahoo.com',
                    path: '/{id}/{name}'
                }
            }
        }
    }

    let routing = new Routing(options);
    expect(routing.generate('persons.findByIdAndName', {id: 'a25f4b6d5', name: 'john'})).toBe('http://yahoo.com/persons/a25f4b6d5/john');
});

test('that routing transforms two parameters into value and not cutting path', () => {

    let options = {
        routes: {
            host: 'http://google.com',

            persons: {
                host: 'http://bing.com',
                path: '/persons',

                findByIdAndName: {
                    host: 'http://yahoo.com',
                    path: '/{id}/{name}/continuePath'
                }
            }
        }
    }

    let routing = new Routing(options);
    expect(routing.generate('persons.findByIdAndName', {id: 'a25f4b6d5', name: 'john'})).toBe('http://yahoo.com/persons/a25f4b6d5/john/continuePath');
});


test('that routing transforms parameters into value with word in the middle', () => {

    let options = {
        routes: {
            host: 'http://google.com',

            persons: {
                host: 'http://bing.com',
                path: '/persons',

                findByIdAndName: {
                    host: 'http://yahoo.com',
                    path: '/{id}/word/{name}'
                }
            }
        }
    }

    let routing = new Routing(options);
    expect(routing.generate('persons.findByIdAndName', {id: 'a25f4b6d5', name: 'john'})).toBe('http://yahoo.com/persons/a25f4b6d5/word/john');
});

test('that routing removes trailing hashes', () => {

    let options = {
        routes: {
            host: 'http://google.com',

            persons: {
                host: 'http://bing.com',
                path: '/persons',

                findAll: {
                    host: 'http://yahoo.com/',
                    path: '/all'
                }
            }
        }
    }

    let routing = new Routing(options);
    expect(routing.generate('persons.findAll')).toBe('http://yahoo.com/persons/all');
});
