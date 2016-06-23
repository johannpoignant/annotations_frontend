angular.module('camomileApp.directives.video', [
    "com.2fdevs.videogular",
    "rzModule"
])
    .directive('camomileVideo', function ($interval, camomileToolsConfig) {
        return {
            restrict: 'AE',
            templateUrl: camomileToolsConfig.moduleFolder + 'video/videoView.html',
            require: '^camomileBox',
            scope: {
                src: '='
            },
            controller: function ($scope) {
                $scope.Math = window.Math;

                $scope.video = {};

                /**
                 * Slider object for using as timeline below video.
                 * @type {Object}
                 */
                $scope.slider = {
                    value: 0,
                    lastValue: 0,
                    options: {
                        floor: 0,
                        ceil: undefined,
                        translate: function(value) {
                            var min = $scope.Math.floor(value / 60);
                            var sec = value % 60;
                            if (min < 10) min = '0' + min;
                            if (sec < 10) sec = '0' + sec;
                            return min + ':' + sec;
                        }
                    }
                };

                $scope.video.getStatus = function () {
                    return $scope.video.API.currentState;
                };

                /**
                 * Store the API of the player when it is ready
                 * @param  {[type]} API [description]
                 * @return {[type]}     [description]
                 */
                $scope.video.onPlayerReady = function (API) {
                    $scope.video.API = API;
                    if ($scope.dataCtrl) {$scope.video.updateSlider();}
                };

                /**
                 * Alerts the timestamp
                 * @return {undefined}
                 */
                $scope.video.alertTimestamp = function () {
                    $scope.dataCtrl.showMessage('Timestamp: ' + window.Math.floor($scope.video.API.currentTime) + 'ms', 2500);
                };

                /**
                 * Plays the video
                 * @return {undefined}
                 */
                $scope.video.videoPlay = function () {
                    $scope.video.API.play();
                };

                /**
                 * Pauses the video
                 * @return {undefined}
                 */
                $scope.video.videoPause = function () {
                    $scope.video.API.pause();
                };

                /**
                 * Stops the video
                 * @return {undefined}
                 */
                $scope.video.videoStop = function () {
                    $scope.video.API.pause();
                    $scope.video.API.seekTime(100, true);
                };

                /**
                 * Stops the video and sets the timeline at 0
                 * @return {undefined}
                 */
                $scope.video.videoBegin = function () {
                    $scope.video.API.pause();
                    $scope.video.API.seekTime(0, true);
                };

                /**
                 * Stops the video and sets the timeline at the end
                 * @return {undefined}
                 */
                $scope.video.videoEnd = function () {
                    $scope.video.API.pause();
                    $scope.video.API.seekTime(100, true);
                };

                /**
                 * Next frame on the video playing
                 * @return {undefined}
                 */
                $scope.video.nextFrame = function () {
                    var ta = $scope.video.API.currentTime;
                    $scope.video.API.seekTime(ta / 1000 + 1 / 25, false);
                };

                /**
                 * Previous frame on the video playing
                 * @return {undefined}
                 */
                $scope.video.previousFrame = function () {
                    var ta = $scope.video.API.currentTime;
                    $scope.video.API.seekTime(ta / 1000 - 1 / 25, false);
                };

                /**
                 * Next second on the video playing
                 * @return {undefined}
                 */
                $scope.video.nextSecond = function () {
                    var ta = $scope.video.API.currentTime;
                    $scope.video.API.seekTime(ta / 1000 + 1, false);
                };

                /**
                 * Previous second on the video playing
                 * @return {undefined}
                 */
                $scope.video.previousSecond = function () {
                    var ta = $scope.video.API.currentTime;
                    $scope.video.API.seekTime(ta / 1000 - 1, false);
                };

                /**
                 * Set up the interval for the synchronisation of the slider with the player
                 */
                $scope.video.updateSlider = function () {
                    if ($scope.video.API) {
                        var nval = $scope.slider.value, lastVal = $scope.slider.lastValue;
                        if (nval != lastVal) {
                            $scope.video.API.seekTime($scope.slider.value, false);
                        } else {
                            $scope.slider.value = $scope.Math.floor($scope.video.API.currentTime / 1000);
                        }

                        if (!$scope.slider.options.ceil) {
                            $scope.slider.options.ceil = $scope.Math.floor($scope.video.API.totalTime / 1000);
                        }
                    }
                    $scope.slider.lastValue = $scope.slider.value;
                    $scope.dataCtrl.facto.video.currentTime = $scope.slider.value;
                    if (!$scope.ttSet && $scope.video.API.totalTime) {
                        $scope.dataCtrl.facto.video.totalTime = $scope.Math.floor($scope.video.API.totalTime / 1000);
                        $scope.ttSet = true;
                    }
                };

                $scope.video.updateTime = function () {
                    $scope.video.updateSlider();
                    if ($scope.dataCtrl.apis.details) {
                        $scope.dataCtrl.apis.details.updateTimebar();
                        $scope.dataCtrl.apis.details.refreshEventline();
                    }
                };
            },
            link: function (scope, elem, attrs, controllerInstance) {
                scope.dataCtrl = controllerInstance;
                scope.elem = elem;

                scope.video.refresh = function () {
                    scope.video.dimensions = {
                        width: elem.find('video').width(),
                        height: elem.find('video').height()
                    };

                    let nb = elem.find('video-control button').length;
                    let divWidth = elem.find('video-control').parent().width();

                    scope.elem
                        .find('video-control button')
                        .css('width', window.Math.floor(1 / nb * scope.video.dimensions.width) + 'px')
                        .find('video-control')
                        .parent()
                        .css('margin-left', window.Math.floor((divWidth % nb) / 2));

                    if (scope.dataCtrl.apis.canvas)
                        scope.dataCtrl.apis.canvas.refresh();

                    scope.interval = $interval(function () {
                        if (scope.video.getStatus() == "play") {
                            scope.video.updateTime();
                        }
                    }, 100);

                    scope.$on('$destroy', function() {
                        console.log("Destroying");
                        controllerInstance.apis.video = undefined;
                        $interval.cancel(scope.interval);
                    });
                };

                controllerInstance.apis.video = scope.video;
                controllerInstance.apis.image = undefined;
            }
        }
    })
    .directive('videoControl', function () {
        return {
            restrict: 'AE',
            transclude: true,
            scope: {
                action: '&'
            },
            template: '<button class="btn btn-default" type="button" ng-click="action()" ng-transclude></btn>'
        }
    });
