angular.module('camomileApp.controllers.objects', [])
.controller('ObjectsCtrl', function ($scope, Camomile) {
  $scope.ctrl = true;

  $scope.corpora = [];
  $scope.objects = [];

  $scope.corpusSelected = undefined;
  $scope.objectSelected = undefined;

  $scope.getAllCorpora = function() {
    Camomile.getCorpora(function(err, data) {
      if (err) {
        $scope.corporaExisting = [];
      } else {
        $scope.$apply(function() {
          $scope.corporaExisting = data;
        });
      }
    });
  };

  $scope.init = function () {
    $scope.getAllCorpora();
  };

  $scope.init();
});
