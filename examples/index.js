
var Routing = require('./../lib/routing');

const routes = require('./routes.js');

let options = {
    routes
};

routing = new Routing(options);


console.log('->>>', routing.generate('persons.findAll'));
console.log('->>>', routing.generate('persons.findById', {'id': 1}));