angular.module('camomileApp.controllers.segmentation', [])
    .controller('SegmentationCtrl', ['$scope', 'cappdata', function ($scope, cappdata) {
        var updateData = function () {
            $scope.$apply(function () {
                $scope.cappdata = cappdata;
            });
        };

        cappdata.registerObserver(updateData);

        $scope.recordingEvent = false;
        $scope.api = this;

        $scope.beginEvent = function () {
            console.log(this.api);
            if (!$scope.recordingEvent) {
                console.log("Begging the event");
                $scope.recordingEvent = true;
                this.api.details.addEvent(window.Math.floor(this.api.video.API.currentTime / 1000), 0, "test");
                $scope.eventInterval = $interval(function () {
                    this.api.details.getLastEvent().duration = this.api.details.getLastEvent().begin - window.Math.floor(this.api.video.API.currentTime / 1000);
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
            cappdata.update('media', $scope.corpus);
        };

        $scope.updateView = function () {
            cappdata.getMediumInfos($scope.medium);
        };
    }]);
