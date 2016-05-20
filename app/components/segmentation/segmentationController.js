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
        $scope.details = {};

        $scope.beginEvent = function () {
            console.log($scope.details);
            if (!$scope.recordingEvent) {
                console.log("Begging the event");
                $scope.recordingEvent = true;
                $scope.details.api.details.addEvent($scope.details.api.video.API.currentTime, 0, "test");
                console.log($scope.details.api.details.getLastEvent());
                $scope.eventInterval = $interval(function () {
                    $scope.details.api.details.getLastEvent().duration = $scope.details.api.video.API.currentTime - $scope.details.api.details.getLastEvent().begin;
                    $scope.details.api.details.refreshEventline();
                }, 250);
            }
        };

        $scope.endEvent = function () {
            if ($scope.recordingEvent) {
                console.log("Ending the event");
                $scope.recordingEvent = false;
                $interval.cancel($scope.eventInterval);
            }
        };

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
