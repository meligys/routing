# Routing - a simple routes helper.

[![CircleCI](https://img.shields.io/circleci/project/github/meligys/routing.svg)](https://circleci.com/gh/meligys/workflows/routing/tree/master) [![Npm Package](https://img.shields.io/npm/v/@meligys/routing.svg)](https://www.npmjs.com/package/@meligys/routing)

> No more hard-coded URI defining like : `fetch('http://example.com/api/persons/' + id).then(....)`. This library has no external deps.

## Getting started

### Install

`npm install --save @meligys/routing`

### Examples

#### Without any dependencies


```
var Routing = require('@meligys/routing');

const routes = {
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

let options = {
    routes
};

routing = new Routing(options);

console.log(routing.generate('persons.findAll'));
console.log(routing.generate('persons.findById', {'id': 1}));
```

> You can also externalize the routes file


First, create a file with routes `routes.js` :

```

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
        },
        findByParam: {
            path: "?myparam={myparam}&another={anotherParam}"
        }
    }
}

```

Then, in the file you are using the router:

```
var Routing = require('@meligys/routing');

const routes = require('path/to/routes.js')

let options = {
    routes
};

routing = new Routing(options);

console.log(routing.generate('persons.findAll'));
console.log(routing.generate('persons.findById', {'id': 1}));
```

#### Testing your config file

You can test the example `routes.js` file by using `tester.js` in the lib folder.
For example :
```
node scripts/tester.js examples/routes.js
```

If you installed that package through npm, the test would be :
```
node node_modules/@meligys/routing/scripts/tester.js node_modules/@meligys/routing/examples/routes.js
```

You can of course change the last argument to your own config file using a relative path only.

#### With the dependency config (optional)

You may have different environments, so you can have different hosts for each environment.

> The following code is not routing specific, it's just a solution to get the routes for the right environment. For more infos about config, please refer to [https://github.com/lorenwest/node-config](https://github.com/lorenwest/node-config)

Install config: `npm install --save config`

```
var config = require('config');

var routesPath = config.get('routesPath');

const routes = require(routesPath)

let options = {
    routes
};

routing = new Routing(options);

console.log(routing.generate('persons.findAll'));
console.log(routing.generate('persons.findById', {'id': 1}));

```

## Contribution

Feel free to contribute, add issues and :star: the repository :sparkler:
