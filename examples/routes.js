
module.exports = {
    host: "http://google.com",

    persons: {
        path: '/persons',

        findAll: {
            host: 'http://bing.com',
            path: "/list",
        },
        findById: {
            path: "/{id}",
        }
    }
}