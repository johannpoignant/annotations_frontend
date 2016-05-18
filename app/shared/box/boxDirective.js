angular.module('camomileApp.directives.box', [
    "ngAnimate"
])
    .directive('camomileBox', function ($interval, camomileToolsConfig) {
        return {
            restrict: 'AE',
            scope: {
                infos: '@', // Needed: id_layer, id_medium in {layer: '', medium: ''}
                extApi: '=?api'
            },
            transclude: true,
            template: '<div ng-transclude></div>',
            controller: function ($scope) {
                var facto = this.facto = {};
                var apis = this.apis = $scope.apis = {};

                /**
                 * Watcher to update the annotations when the infos param is complete
                 * @return {undefined}
                 */
                $scope.$watch("infos", function () {
                    if ($scope.infos) {
                        $scope.infosParsed = JSON.parse($scope.infos);
                        if (apis.edit) {
                            apis.edit.getAnnotations();
                        }
                    }
                }, true);

                this.infos = function () {
                    return $scope.infosParsed;
                };

                var isVideo = this.isVideo = function () {
                    return apis.video !== undefined;
                };

                facto.annotations = $scope.annotations = [];
                facto.config = {
                    strokeColor: '#fff', // Stroke color choosen
                    fillColor: '#fff', // Fill color choosen
                    colors: [ // Colors available
                        {color: '#f00', description: 'Red'},
                        {color: '#00f', description: 'Blue'},
                        {color: '#0f0', description: 'Green'},
                        {color: '#fff', description: 'White'}
                    ],
                    drawStyle: 'free', // Style choosen
                    drawStyles: [ // Styles available
                        {key: 'free', description: 'Free form'},
                        {key: 'rectangle', description: 'Rectangle'},
                        {key: 'circle', description: 'Circle'}
                    ],
                    strokeWidth: 2, // Stroke width (line width) choosen
                    fontFamily: 'Arial',
                    fontSize: 36
                    // font: fontSize + 'px ' + fontFamily // The font used to draw text
                };
                facto.config.font = facto.config.fontSize + 'px ' + facto.config.fontFamily; // The font used to draw text
                facto.video = { // video time available here (in seconds)
                    currentTime: 0,
                    totalTime: 0
                };

                /**
                 * Saves the annotation
                 */
                this.saveAnnotation = function () {
                    var a = facto.annotation; // Shortcut
                    if (a.id == 0 && a.fragment.points.length > 1 && a.fragment.name != "") {
                        if (isVideo()) {
                            a.fragment.timestamp = apis.video.API.currentTime;
                        }

                        // Copy the object to insert it into the array; however, warning: slow copy
                        facto.annotations.push(JSON.parse(JSON.stringify(a)));
                        apis.canvas.clearCanvas(true);

                        $scope.showMessage("Saved annotation!", 3000);
                    }
                };

                /**
                 * Resets the annotation
                 * @return {undefined}
                 */
                this.newAnnotation = $scope.newAnnotation = function() {
                    facto.annotation = {
                        id: 0,
                        fragment: {
                            name: '',
                            drawStyle: facto.config.drawStyle,
                            points: []
                        }
                    };
                    if (isVideo()) {
                        facto.annotation.fragment.duration = 2000;
                    }
                };

                this.newAnnotation();

                this.setAnnotations = function (ans) {
                    $scope.$apply(function () {
                        // HAHAHA
                        /*for (d in $scope.annotations) {
                            delete $scope.annotations[d];
                        }
                        $scope.annotations.length = 0;*/
                        $scope.annotations = [];
                        for (a of ans) {
                            $scope.annotations.push(a);
                        }
                    });
                };

                this.mediaDimensions = function () {
                    if (apis.video) {
                        return apis.video.dimensions;
                    } else if (apis.image) {
                        return apis.image.dimensions;
                    }
                };

                if ($scope.extApi) { // Bind api if provided
                    $scope.extApi.api = $scope.apis;
                }
            },
            link: function (scope, elem, attrs) {
                scope.interval = $interval(function () { // Check for dimensions changes
                    scope.dimensions = {
                        width: elem.find('div').width(),
                        height: elem.find('div').height()
                    };
                    if (  !scope.lastDimensions
                        || scope.dimensions.width != scope.lastDimensions.width
                        || scope.dimensions.height != scope.lastDimensions.height) { // If dimensions are not the same
                        // Trigger refresh of all components
                        if (scope.apis.graph)
                            scope.apis.graph.refresh();
                        if (scope.apis.image)
                            scope.apis.image.refresh();
                        if (scope.apis.video)
                            scope.apis.video.refresh();
                        if (scope.apis.details)
                            scope.apis.details.refresh();
                        // if (scope.apis.)
                        //   scope.apis..refresh();

                        scope.newAnnotation();
                    }
                    scope.lastDimensions = scope.dimensions;
                }, 500);

                scope.$on('$destroy', function() {
                    $interval.cancel(scope.interval);
                });
            }
        }
    });
