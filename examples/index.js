
const configurationFile = require("./routing.js");

let routes = undefined;
if (configurationFile.configEnabled) {
    const config = require('config');
    routes = config.get(configurationFile.routesFile);
} else {
    routes = require(configurationFile.routesFilePath);

}


function generate(resource, method, params) {
    console.log("GENERATE", resource, method, params);
    
    if(!resource || !method) {
        console.error("You must specify resource and method");
    }

    let route = "";

    if (routes[resource] && routes[resource][method]) {
        let path = (routes[resource][method]['path']) ? routes[resource][method]['path'] : routes[resource][method];

        let host = routes.host;
        
        if (routes[resource][method]['host']) {
            host = routes[resource][method]['host'];
        } else if (routes[resource]['host']) {
            host = routes[resource]['host'];
        }

        let resourcePath = routes[resource].path;

        console.log("ROUTE ", host, resourcePath);
        route = host + resourcePath;
        
        if (params) {
            let parameteredPath = replaceParams(path, params);
            route = route + parameteredPath;
        }

        return route;
    }
}

function replaceParams(path, params) {
    
    for (var property in params) {
        path = path.replace(`{${property}}`, params[property]  );
    }
    
    return path;
}

console.log('->>>', generate('persons', 'findFindAll'));
console.log('->>>', generate('persons', 'findById', {'id': 1}));