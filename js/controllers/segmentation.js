angular.module('camomileApp.controllers.segmentation', [])
.controller('SegmentationCtrl', ['$scope', 'cappdata', 'Camomile', function ($scope, cappdata, Camomile) {
  var updateData = function () {
    $scope.$apply(function () {
      $scope.cappdata = cappdata;
    });
  };

  cappdata.registerObserver(updateData);

  $scope.event = {
    begin: 0,
    duration: 0,
    text: ''
  };

  cappdata.update('corpora');

  $scope.updateMedium = function () {
    cappdata.update('media', $scope.corpus);
  };

  $scope.updateView = function () {
    cappdata.getMediumInfos($scope.medium);
  };
}]);
