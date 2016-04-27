angular.module('camomile.services', [])

.factory('Camomile', ['camomileConfig', '$timeout', function (camomileConfig, $timeout) {

  Camomile.setURL(camomileConfig.backend);
  return Camomile;

}]);
