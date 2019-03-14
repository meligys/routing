const Cache = require('./cache');

const CONST_PATH = 'path';
const CONST_HOST = 'host';
const CONST_OPEN_PARAM = '{';
const CONST_CLOSE_PARAM = '}';
const CONST_PROTO_SEP = '://';
const CONST_OPTS_PARAM = 'params';


class Routing {

  constructor(options, cachePath) {

    if (options && options.routes) {
      this.routes = options.routes;
    }

    this.json = {}
    this.cache = new Cache(cachePath);
    this.generateCache();
    this.cache.write(this.json);
    //empty json in memory
    this.json = {};
  }

  generateCache() {

    for (const i in this.routes) {

      if (i === CONST_HOST) {
        continue;
      }

      this.json[i] = this.generateRoute(i);
      this.shrinkRoutes([i], this.routes[i]);
    }
  }

  shrinkRoutes(indexArray, json) {

    for (const i in json) {

      if (i === CONST_HOST || i === CONST_PATH) {
        continue;
      }

      const index = indexArray.join('.');
      this.json[indexArray[0] + '.' + i] = this.generateRoute(index + '.' + i);
      const tempArray = Array.from(indexArray);
      tempArray.push(i);
      this.shrinkRoutes(tempArray, json[i]);
    }
  }

  generateRoute(routeName) {
    const resources = routeName.split('.');

    let host = "" + this.routes[CONST_HOST];
    let tempRoute = this.routes;
    let path = "";


    for (const s of resources) {
      this.inputCheck(tempRoute, s, routeName);
      tempRoute = tempRoute[s];
      if (tempRoute[CONST_HOST]) {
        host = tempRoute[CONST_HOST];
      }

      if (tempRoute[CONST_PATH]) {
        path += tempRoute[CONST_PATH];
      }
    }
    return this.removeRouteDoubleSlashes(host + path);
  }

  generate(routeName, opts) {

    const path = this.cache.get(routeName);
    const pathWithParameters = this.placeParameters(path, opts);

    if (!opts) {
      return pathWithParameters;
    }

    return this.handleOpts(pathWithParameters, opts)
  }

  inputCheck(route, index, routeName) {
    if (!route[index]) {
      throw new Error(`No route defined with the following parameter: ${routeName}`)
    }
  }

  placeParameters(path, opts) {


    const startParamIndex = path.indexOf(CONST_OPEN_PARAM);
    const paramDefined = opts && opts[CONST_OPTS_PARAM];

    if (startParamIndex != -1 && !paramDefined) {
      console.log(`Missing parameter for ${path}`);
    }

    if (startParamIndex != -1 && paramDefined) {
      const endParamIndex = path.indexOf(CONST_CLOSE_PARAM);
      const parameter = opts[CONST_OPTS_PARAM][path.substring(startParamIndex + 1, endParamIndex)];
      path = path.replace(path.substring(startParamIndex, endParamIndex + 1), parameter);
      return this.placeParameters(path, opts);
    }

    return path;
  }

  handleOpts(path, opts) {

    if (opts.ignoreHost) {
      path = this.ignoreHost(path);
    }

    return path
  }

  ignoreHost(path) {

    const protocolIndex = path.indexOf(CONST_PROTO_SEP);

    // no check on protocol absence as the `new Routing(opts)`will have errored in that case

    path = path.slice(protocolIndex + CONST_PROTO_SEP.length);
    return path.indexOf('/') === -1 ? path : path.slice(path.indexOf('/'));
  }


  removeRouteDoubleSlashes(route, opts) {

    if (opts && opts.ignoreHost) {
      return route.split('//').join('/');
    }

    let protoIndex = route.indexOf(CONST_PROTO_SEP);
    if (protoIndex === -1) {
      throw new Error('Route definition must have a protocol')
    }

    let endProtoIndex = protoIndex + CONST_PROTO_SEP.length;
    let protocol = route.slice(0, endProtoIndex);
    let toClean = route.slice(endProtoIndex);

    toClean = toClean[0] === '/' ? toClean.slice(1) : toClean;
    return protocol + toClean.split('//').join('/');
  }
}

module.exports = Routing;
