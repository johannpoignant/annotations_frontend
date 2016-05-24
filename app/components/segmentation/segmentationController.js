angular.module('camomileApp.controllers.segmentation', [])
    .controller('SegmentationCtrl', ['$scope', '$timeout', '$interval', 'cappdata', function ($scope, $timeout, $interval, cappdata) {
        $scope.api = {};

        var refresh = function () {
            cappdata.clean();
            cappdata.update('corpora');
            cappdata.registerObserver(updateData);
        };

        var updateData = function () {
            $timeout(function () {
                $scope.cappdata = cappdata;
                $scope.api.loader.finished();
            }, 0);
        };

        $scope.$parent.onLogin(refresh);

        refresh();
        $scope.recordingEvent = false;

        $scope.updateMedium = function () {
            if ($scope.corpus) {
                $scope.api.loader.loading(2);
                cappdata.update('media', $scope.corpus, 'video');
                cappdata.update('layers', $scope.corpus);
            }
        };

        $scope.updateView = function () {
            if ($scope.medium) {
                cappdata.resetMedium();
                cappdata.update('medium', $scope.medium);
            }
        };
    }]);