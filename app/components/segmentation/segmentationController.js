angular.module('camomileApp.controllers.segmentation', [])
    .controller('SegmentationCtrl', ['$scope', '$timeout', '$interval', 'cappdata', function ($scope, $timeout, $interval, cappdata) {
        var updateData = function () {
            $timeout(function () {
                $scope.cappdata = cappdata;
            }, 0);
        };

        cappdata.registerObserver(updateData);

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
                }, 1000);
            }
        };

        $scope.endEvent = function () {
            if ($scope.recordingEvent) {
                console.log("Ending the event");
                $scope.recordingEvent = false;
                $interval.cancel($scope.eventInterval);
            }
        };

        cappdata.update('corpora');

        $scope.updateMedium = function () {
            cappdata.update('media', $scope.corpus, 'video');
        };

        $scope.updateView = function () {
            cappdata.resetMedium();
            cappdata.update('medium', $scope.medium);
        };
    }]);
