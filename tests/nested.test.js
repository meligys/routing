const Routing = require('./../lib/routing');

test('that base nested path is supported', () => {

    let options = {
        routes: {
            persons: {
              host: 'https://www.google.com',
              path: '/persons',

                findById: {
                    path: "/{id}",
                    getSettings: {
                        path: '/settings'
                    }
                }
            }
        }
    };

    let routing = new Routing(options);
    expect(routing.generate('persons.findById.getSettings', {params: {id: 'a25f4b6d5'}}))
    .toBe('https://www.google.com/persons/a25f4b6d5/settings');
});

test('that more complex nested path is supported', () => {

    let options = {
        routes: {
            persons: {
                host: 'https://www.google.com',
                path: '/persons',

                findById: {
                    path: "/{id}",
                    getSettings: {
                        path: '/settings',

                        findByThisId: {
                            path: "/{settings_id}"
                        }
                    }
                }
            }
        }
    };

    let routing = new Routing(options);
    expect(routing.generate('persons.findById.getSettings.findByThisId', {params: {id: 'a25f4b6d5', settings_id: '12345'}}))
        .toBe('https://www.google.com/persons/a25f4b6d5/settings/12345');
});

test('five levels nested path is supported', () => {

    let options = {
        routes: {
            persons: {
                host: 'https://www.google.com',
                path: '/persons',

                findById: {
                    path: "/{id}",
                    getSettings: {
                        path: '/settings',

                        findByThisId: {
                            path: "/{settings_id}",

                            actOn: {
                                path: '/action',

                                resetIt: {

                                    path: "/reset"
                                }
                            }
                        }
                    }
                }
            }
        }
    };

    let routing = new Routing(options);
    expect(routing.generate('persons.findById.getSettings.findByThisId.actOn.resetIt', {params: {id: 'a25f4b6d5', settings_id: '12345'}}))
        .toBe('https://www.google.com/persons/a25f4b6d5/settings/12345/action/reset');
});

test('nested path finds its way', () => {

    let options = {
        routes: {
            persons: {
                host: 'https://www.google.com',
                path: '/persons',

                findById: {
                    path: "/{id}",
                    getSettings: {
                        path: '/settings',

                        findByThisId: {
                            path: "/{settings_id}",

                            actOn: {
                                path: '/action',

                                resetIt: {

                                    path: "/reset"
                                }
                            }
                        }
                    }
                }
            },

            notPersons: {
                host: 'https://www.bing.com',
                path: '/notPersons',

                findById: {
                    path: "/{id}",

                    getSettings: {
                        path: '/notSettings'
                    }
                }
            }
        }
    };

    let routing = new Routing(options);
    expect(routing.generate('notPersons.findById.getSettings', {params: {id: 'a25f4b6d5'}}))
        .toBe('https://www.bing.com/notPersons/a25f4b6d5/notSettings');
});