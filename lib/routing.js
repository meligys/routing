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

  generate(routeName, opts) {

    let routeNameSplit = routeName.split('.');
    let resource = routeNameSplit.shift();
    let method = routeNameSplit.shift();
    this.inputCheck(resource, method);

    let path = (this.routes[resource][method][CONST_PATH]) ? this.routes[resource][method][CONST_PATH] : this.routes[resource][method];
    let host = this.routes.host;

    if (this.routes[resource][method][CONST_HOST]) {
      host = this.routes[resource][method][CONST_HOST];
    } else if (this.routes[resource][CONST_HOST]) {
      host = this.routes[resource][CONST_HOST];
    }

    let resourcePath = (this.routes[resource].path) ? this.routes[resource].path : "";

    let route = (opts && opts.ignoreHost) ? resourcePath : host + resourcePath;
    
    if (opts && opts.params) {
      let parameteredPath = this.replaceParams(path, opts.params);
      route = route + parameteredPath;
    } else {
      route = route + path;
    }

    return this.removeRouteDoubleSlashes(route, opts);
  }

  inputCheck(resource, method){

    if(!resource || !method) {
      throw new Error('Both a resource and method must be specified');
    }
    if (!this.routes[resource] || !this.routes[resource][method]){
      throw new Error(`No route defined with the following parameters: ${resource}.${method}`);
    }
  }

  replaceParams(path, params) {

    for (var property in params) {
      path = path.replace(`${CONST_OPEN_PARAM}${property}${CONST_CLOSE_PARAM}`, params[property] );
    }
    return path;
  }

  removeRouteDoubleSlashes(route, opts){

    if (opts && opts.ignoreHost) {
      return route.split('//').join('/');
    }
    
    let protoIndex = route.indexOf(CONST_PROTO_SEP);
    if (protoIndex === -1) {
      throw new Error('Route definition must have a protocol')
    }

    let endProtoIndex = protoIndex+CONST_PROTO_SEP.length;
    let protocol = route.slice(0,endProtoIndex);
    let toClean = route.slice(endProtoIndex);

    toClean = toClean[0] === '/' ? toClean.slice(1) : toClean;
    return protocol + toClean.split('//').join('/');
  }
}

module.exports = Routing;
