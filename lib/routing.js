CONST_PATH = 'path';
CONST_HOST = 'host';
CONST_OPEN_PARAM = '{';
CONST_CLOSE_PARAM = '}';
CONST_PROTO_SEP = '://';
CONST_OPTS_PARAM = 'params';
CONST_OPTS_IGNORE_HOST = 'ignoreHost';

class Routing {

  constructor(options) {

    if (options && options.routes) {
      this.routes = options.routes;
    }
  }

  generate(routeName, opts) {

    let resources = routeName.split('.');
    let tempRoute = this.routes;
    let host = "" + this.routes[CONST_HOST];
    let path = "";

    for (var s of resources){

      this.inputCheck(tempRoute, s, routeName);
      tempRoute = tempRoute[s];
      if (tempRoute[CONST_HOST]) {
          host = tempRoute[CONST_HOST];
      }

      if (tempRoute[CONST_PATH]){
        path += this.addPath(tempRoute[CONST_PATH], opts)
      }
    }

    host = this.handleHost(host, opts && opts[CONST_OPTS_IGNORE_HOST])
    return this.removeRouteDoubleSlashes(host+path);
  }

  inputCheck(currentJSON, entry, routeName){
    if (!currentJSON[entry]) {
      throw new Error(`No route defined with the following parameters: ${routeName}`);
    }
  }

  addPath(path, opts) {

    let start = path.indexOf(CONST_OPEN_PARAM);

    let paramDefined = opts && opts[CONST_OPTS_PARAM];

    if (start != -1 && !paramDefined){
        console.log("Missing parameter for " + path)
    }

    if (start != -1 && paramDefined) {

      let end = path.indexOf(CONST_CLOSE_PARAM);
      let computed =  opts[CONST_OPTS_PARAM][path.substring(start+1, end)];
      path = path.replace(path.substring(start,end+1), computed);

      return this.addPath(path, opts);
    }


    return path;
  }

  handleHost(host, ignoreHost){

    if (ignoreHost){
      return "";
    }

    if (host.indexOf(CONST_PROTO_SEP) === -1) {
        throw new Error(`Route definition must have a protocol`)
      }

    return host;
  }

  removeRouteDoubleSlashes(route){

    let protoIndex = route.indexOf(CONST_PROTO_SEP);

    if (protoIndex == -1) {
        return route.split('//').join('/');
    }
    let start = route.substring(0,protoIndex).split('//').join('/');
    let end = route.substring(protoIndex+CONST_PROTO_SEP.length).split('//').join('/');
    return start+CONST_PROTO_SEP+end;

  }
}

module.exports = Routing;
