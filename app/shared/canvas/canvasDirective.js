angular.module('camomileApp.directives.canvas', [])
    .directive('camomileCanvas', function ($interval, camomileToolsConfig) {
        return {
            restrict: 'AE',
            template: '<canvas ' +
            'class="transparent-plan" ' +
            'oncontextmenu="return false;" ' +
            'height="{{canvas.height}}" ' +
            'width="{{canvas.width}}"' +
            '></canvas>',
            require: '^camomileBox',
            scope: {},
            controller: function ($scope) {
                /**
                 * Draws the point p on the canvas
                 * @param {Object} p the point containing the data of the point
                 * @return {undefined}
                 */
                var drawFragment = function(p) {
                    if (p.points.length > 1) {
                        $scope.canvas.context.beginPath();
                        if (p.drawStyle == "rectangle") {
                            drawRectangle(p.points);
                        } else if (p.drawStyle == "circle") {
                            drawCircle(p.points);
                        } else if (p.drawStyle == "free") {
                            drawFree(p.points);
                        }
                        $scope.canvas.context.stroke();
                        $scope.canvas.context.closePath();
                    } else if (p.points.length == 1) {
                        $scope.canvas.context.beginPath();
                        $scope.canvas.context.arc(p.points[0].x, p.points[0].y, 1, 0, 2 * Math.PI);
                        $scope.canvas.context.fill();
                        $scope.canvas.context.closePath();
                    }
                };

                var drawAnnotation = function (annotation) {
                    $scope.canvas.context.fillText(annotation, 10, $scope.dataCtrl.facto.config.fontSize);
                    $scope.canvas.reloadAnnotationStyles(1);
                    $scope.canvas.context.strokeText(annotation, 10, $scope.dataCtrl.facto.config.fontSize);
                    $scope.canvas.reloadAnnotationStyles();
                };

                /**
                 * Draws a rectangle
                 * @param  {Array} r the points
                 * @return {undefined}
                 */
                var drawRectangle = function(r) {
                    let w = r[1].x - r[0].x, h = r[1].y - r[0].y;
                    $scope.canvas.context.rect(r[0].x, r[0].y, w, h);
                };

                /**
                 * Draws a circle
                 * @param  {Array} c the points
                 * @return {undefined}
                 */
                var drawCircle = function(c) {
                    let m = window.Math; // Math js lib
                    // Radius
                    let r = m.abs(m.sqrt(m.pow(c[0].x - c[1].x, 2) + m.pow(c[0].y - c[1].y, 2)));
                    $scope.canvas.context.arc(c[0].x, c[0].y, r, 0, 2 * Math.PI);
                };

                /**
                 * Draws a free shape
                 * @param  {Array} f the points
                 * @return {undefined}
                 */
                var drawFree = function(f) {
                    $scope.canvas.context.moveTo(f[0].x, f[0].y); // We move to the first point
                    for (p of f.slice(1, f.length)) {
                        $scope.canvas.context.lineTo(p.x, p.y); // And we draw a line to each point
                    }
                };

                $scope.canvas = {};

                $scope.canvas.refresh = function () {
                    let vdims = $scope.dataCtrl.mediaDimensions();
                    if (vdims !== undefined) {
                        $scope.canvas.width = vdims.width;
                        $scope.canvas.height = vdims.height;
                    }
                };

                /**
                 * Used to setup the canvas on the video
                 * @return {undefined}
                 */
                $scope.canvas.setupCanvas = function() {
                    $scope.canvas.clearCanvas(false);
                    $scope.canvas.reloadAnnotationStyles();

                    if ($scope.dataCtrl.isVideo()) { // If this is a video...
                        let time = $scope.dataCtrl.apis.video.API.currentTime;
                        for (a of $scope.dataCtrl.facto.annotations) {
                            // We need to care about the time
                            if (time >= a.fragment.timestamp && time <= a.fragment.timestamp + a.fragment.duration) {
                                drawFragment(a.fragment);
                                drawAnnotation(a.fragment.name);
                            }
                        }
                    } else { // If this is an image however...
                        for (a of $scope.dataCtrl.facto.annotations) {
                            drawFragment(a.fragment); // We draw everything as there is no time involved
                        }
                    }

                    // Don't forget the current annotation
                    drawFragment($scope.dataCtrl.facto.annotation.fragment);
                };

                $scope.canvas.reloadAnnotationStyles = function(mode) {
                    mode = mode ? mode : 0;
                    if (mode === 0) {
                        var c = $scope.dataCtrl.facto.config;
                        $scope.canvas.context.strokeStyle = c.strokeColor;
                        $scope.canvas.context.fillStyle = c.fillColor;
                        $scope.canvas.context.lineWidth = c.strokeWidth;
                        $scope.canvas.context.font = c.font;
                    } else if (mode === 1) {
                        $scope.canvas.context.strokeStyle = '#000';
                        $scope.canvas.context.fillStyle = '#fff';
                        $scope.canvas.context.lineWidth = 1;
                    }
                };

                /**
                 * Allow to know if the current drawing has reached the maximum of points it
                 * can have
                 * @return {boolean} true if the drawing has reached the max. of points it can
                 * have, false otherwise
                 */
                $scope.canvas.isComplete = function() {
                    var a = $scope.dataCtrl.facto.annotation.fragment; // Shortcut
                    if (a.drawStyle == "rectangle" && a.points.length > 1)
                        return true;
                    else if (a.drawStyle == "circle" && a.points.length > 1)
                        return true;
                    else if (a.drawStyle == "free" && a.points.length > 9)
                        return true;
                    else
                        return false;
                };

                /**
                 * Clears the canvas, and if clearPoints is provided and set to true, will
                 * also empty the points array
                 * @param {boolean} clearPoints
                 * @return {undefined}
                 */
                $scope.canvas.clearCanvas = function(clearPoints) {
                    clearPoints = clearPoints !== undefined ? clearPoints : false;
                    if (clearPoints) {
                        $scope.dataCtrl.newAnnotation();
                    }
                    let dims = $scope.dataCtrl.mediaDimensions();
                    if (dims) {
                        $scope.canvas.context.clearRect(0, 0, dims.width, dims.height);
                    }
                };

                $scope.canvas.addPoint = function (point) {
                    let a = $scope.dataCtrl.facto.annotation.fragment;
                    if (!$scope.canvas.isComplete()) {
                        a.points.push({
                            x: point.x,
                            y: point.y
                        });
                    }
                };

                $scope.interval = $interval(function () {
                    if ($scope.dataCtrl.isVideo()) {
                        if ($scope.dataCtrl.apis.video.getStatus() == 'play') {
                            $scope.canvas.setupCanvas();
                        }
                    } else {
                        $scope.canvas.setupCanvas();
                    }
                }, camomileToolsConfig.refreshTime.canvas);

                $scope.$on('$destroy', function() {
                    console.log("Destroying");
                    $interval.cancel($scope.interval);
                });
            },
            link: function (scope, elem, attrs, controllerInstance) {
                scope.dataCtrl = controllerInstance;

                scope.canvas.surface = elem.find('canvas')[0];
                scope.canvas.context = scope.canvas.surface.getContext('2d');

                scope.canvas.mode = 0;

                /*
                 MODE:
                 0: nothing to do
                 1: editing last point
                 2: moving all the annotation
                 */
                elem
                    .bind('mousedown', function (e) {
                        console.log(e);
                        let a = scope.dataCtrl.facto.annotation.fragment;

                        if (e.button == 0) {
                            scope.canvas.mode = 1;
                            if (a.points.length == 0) {
                                scope.canvas.addPoint({x: e.offsetX, y: e.offsetY});
                                scope.canvas.addPoint({x: e.offsetX, y: e.offsetY});
                            } else {
                                scope.canvas.addPoint({x: e.offsetX, y: e.offsetY});
                            }
                        } else if (e.button == 1) {
                            scope.canvas.clearCanvas(true);
                        } else if (e.button == 2) {
                            scope.canvas.mode = 2;
                            scope.lastOrigin = {x: e.offsetX, y: e.offsetY};
                        }
                    })
                    .bind('mouseup', function (e) {
                        console.log(e);
                        scope.canvas.mode = 0;
                    })
                    .bind('mousemove', function (e) {
                        let pts = scope.dataCtrl.facto.annotation.fragment.points;

                        if (scope.canvas.mode == 1) {
                            pts[pts.length - 1] = {x: e.offsetX, y: e.offsetY};
                        } else if (scope.canvas.mode == 2) {
                            let origin = {x: e.offsetX, y: e.offsetY};
                            for (p of pts) {
                                p.x = p.x + (origin.x - scope.lastOrigin.x);
                                p.y = p.y + (origin.y - scope.lastOrigin.y);
                            }
                            scope.lastOrigin = {x: e.offsetX, y: e.offsetY};
                        }
                        scope.canvas.setupCanvas();
                    });

                scope.dataCtrl.apis.canvas = scope.canvas;
            }
        }
    });
