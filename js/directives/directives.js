angular.module('camomileApp.directives', [])
.directive('listView', ['$sce', 'Camomile', function(Camomile, $sce) {
  return {
    templateUrl: 'js/directives/listView.html',
    scope: {
      video: '='
    }
  };
}]);
