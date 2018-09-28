CONST_PATH = 'path';
CONST_HOST = 'host';
CONST_OPEN_PARAM = '{';
CONST_CLOSE_PARAM = '}'
CONST_PROTO_SEP = '://';

class Routing {

    constructor(options) {

        if (options && options.routes) {
            this.routes = options.routes;
        }
    }

    generate(routeName, params) {
        let routeNameSplit = routeName.split('.');

        let resource = routeNameSplit.shift();
        let method = routeNameSplit.shift();

        if(!resource || !method) {
            console.error("You must specify resource and method");
            return;
        }

        let route = "";

        if (this.routes[resource] && this.routes[resource][method]) {
            let path = (this.routes[resource][method][CONST_PATH]) ? this.routes[resource][method][CONST_PATH] : this.routes[resource][method];

            let host = this.routes.host;

            if (this.routes[resource][method][CONST_HOST]) {
                host = this.routes[resource][method][CONST_HOST];
            } else if (this.routes[resource][CONST_HOST]) {
                host = this.routes[resource][CONST_HOST];
            }

            let resourcePath = this.routes[resource].path;

            route = host + resourcePath;

            if (params) {
                let parameteredPath = this.replaceParams(path, params);
                route = route + parameteredPath;
            } else {
                route = route + path;
            }

            return this.clean(route);
        } else {
            console.error("No route defined with the following parameters", resource, method);
        }
    }

    replaceParams(path, params) {

        for (var property in params) {
            path = path.replace(`${CONST_OPEN_PARAM}${property}${CONST_CLOSE_PARAM}`, params[property]  );
        }

        return path;
    }

  clean(route){

    let endProtoIndex = route.indexOf(CONST_PROTO_SEP)+CONST_PROTO_SEP.length;
    let proto = route.slice(0,endProtoIndex);
    let toClean = route.slice(endProtoIndex);
    return proto+toClean.split('//').join('/');
  }
}

module.exports = Routing;
