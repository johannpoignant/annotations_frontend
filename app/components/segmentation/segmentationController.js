angular.module('camomileApp.controllers.segmentation', [])
    .controller('SegmentationCtrl', ['$scope', '$timeout', '$interval', 'cappdata', function ($scope, $timeout, $interval, cappdata) {
        $scope.api = {};

        var refresh = function () {
            cappdata.clean();
            cappdata.get('corpora');
            cappdata.registerObserver(updateData);
        };

        var updateData = function () {
            $timeout(function () {
                $scope.cappdata = cappdata;
                $scope.api.loader.finished();
                /*if ($scope.api.box && $scope.api.box.details)
                    $scope.api.box.details.getEvents();*/
            }, 0);
        };

        $scope.$parent.onLogin(refresh);

        refresh();
        $scope.recordingEvent = false;

        $scope.updateMedium = function () {
            if ($scope.corpus) {
                $scope.api.loader.loading(2);
                cappdata.get('media', $scope.corpus, 'video');
                cappdata.get('layers', $scope.corpus);
            }
        };

        $scope.updateView = function () {
            if (!$scope.api.infos) {$scope.api.infos = {};}
            if ($scope.medium) {
                $scope.api.infos.medium = $scope.medium;
                cappdata.resetMedium();
                cappdata.get('medium', $scope.medium);
            }
            if ($scope.layer) {
                $scope.api.infos.layer = $scope.layer;
            }
            if ($scope.layer && $scope.medium) {
                $scope.api.box.details.getEvents();
            }
        };
    }]);