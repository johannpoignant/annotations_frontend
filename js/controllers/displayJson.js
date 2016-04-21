angular.module('camomileApp.controllers.displayJson', [])

.directive('displayJson', function() {
  return {
    templateUrl: 'views/displayJson.html',
    restrict: 'E',
    scope: {
      data: '='
    }
  }
})

.controller('DisplayJsonCtrl', function($scope) {
  $log.log($scope.data);
});
