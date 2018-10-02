var Routing = require('./routing');

let path = process.argv[2]
const routes = require(path);

let options = {
  routes
};

routing = new Routing(options);
test(options);


function test(options){

  var toTest=[];
  console.log("Discovered routes :")
  for (var index in options['routes']){
    for (var inside in options['routes'][index]){
      if (inside == 0 ){
        break;
      }

      if (inside == 'path'){
        continue;
      }

      toTest.push(`${index}.${inside}`)
    }

    for (var i in toTest){
      console.log('->>>', routing.generate(toTest[i]));
    }
  }
}
