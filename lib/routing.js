const Cache = require('./cache');

const CONST_PATH = 'path';
const CONST_HOST = 'host';
const CONST_OPEN_PARAM = '{';
const CONST_CLOSE_PARAM = '}';
const CONST_PROTO_SEP = '://';
const CONST_OPTS_PARAM = 'params';
const CONST_OPTS_IGNORE_HOST = 'ignoreHost';


class Routing {

  constructor(options, cachePath) {

    if (options && options.routes) {
      this.routes = options.routes;
    }

    this.json = {}
    this.cache = new Cache(cachePath);
    this.generateCache();
    this.cache.write(this.json);
    //empty json in memory, cache will do it
    this.json = {};
  }

  generateCache() {

    for (const i in this.routes) {

      if (i === CONST_HOST) {
        continue;
      }

      this.json[i] = i;
      this.shrinkRoutes([i], this.routes[i]);
    }
  }

  shrinkRoutes(indexArray, json) {

    for (const i in json) {

      if (i === CONST_HOST || i === CONST_PATH) {
        continue;
      }

      const index = indexArray.join('.');
      this.json[indexArray[0] + '.' + i] = index + '.' + i;
      const tempArray = Array.from(indexArray);
      tempArray.push(i);
      this.shrinkRoutes(tempArray, json[i]);
    }
  }

  generate(routeName, opts) {

    const fullTarget = this.cache.get(routeName);
    const resources = fullTarget.split('.');

    let host = "" + this.routes[CONST_HOST];
    let tempRoute = this.routes;
    let path = "";

    for (const s of resources) {

      this.inputCheck(tempRoute, s, fullTarget);
      tempRoute = tempRoute[s];
      if (tempRoute[CONST_HOST]) {
        host = tempRoute[CONST_HOST];
      }

      if (tempRoute[CONST_PATH]) {
        path += this.addPath(tempRoute[CONST_PATH], opts)
      }
    }

    host = this.handleHost(host, opts && opts[CONST_OPTS_IGNORE_HOST])
    return this.removeRouteDoubleSlashes(host + path);
  }

  inputCheck(route, index, routeName) {
    if (!route[index]) {
      throw new Error(`No route defined with the following parameter: ${routeName}`)
    }
  }

  inputCheck(route, index, routeName) {
    if (!route[index]) {
      throw new Error(`No route defined with the following parameters: ${routeName}`);
    }
  }

  addPath(path, opts) {

    const startParamIndex = path.indexOf(CONST_OPEN_PARAM);
    const paramDefined = opts && opts[CONST_OPTS_PARAM];

    if (startParamIndex != -1 && !paramDefined) {
      console.log(`Missing parameter for ${path}`);
    }

    if (startParamIndex != -1 && paramDefined) {
      const endParamIndex = path.indexOf(CONST_CLOSE_PARAM);
      const parameter = opts[CONST_OPTS_PARAM][path.substring(startParamIndex + 1, endParamIndex)];
      path = path.replace(path.substring(startParamIndex, endParamIndex + 1), parameter);
      return this.addPath(path, opts);
    }

    return path;
  }

  handleHost(host, ignoreHost) {

    if (ignoreHost) {
      return "";
    }

    if (host.indexOf(CONST_PROTO_SEP) === -1) {
      throw new Error(`Route definition must have a protocol`)
    }

    return host;
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
