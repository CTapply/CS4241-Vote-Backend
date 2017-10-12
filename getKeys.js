// helper to get an object's non-inherited keys. gotten from https://stackoverflow.com/questions/208016/how-to-list-the-properties-of-a-javascript-object
var getKeys = function(obj) {
  var keys = [];
  for(var key in obj){
     keys.push(key);
  }
  return keys;
}
module.exports = getKeys;
