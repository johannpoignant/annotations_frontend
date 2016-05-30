angular.module('camomileApp.directives.details', [
    "nvd3",
    "ui.bootstrap"
])
    .directive('camomileDetails', function ($log, $interval, $timeout, $uibModal, camomileToolsConfig, cappdata) {
        return {
            restrict: 'AE',
            templateUrl: camomileToolsConfig.moduleFolder + 'details/detailsView.html',
            require: '^camomileBox',
            scope: {
                data: '@',
                graph: '@?'
            },
            controller: function ($scope) {
                $scope.graph = $scope.graph === undefined ? true : $scope.graph;

                $scope.api = {};

                $scope.index = 0;

                var updateData = $scope.updateData = function () {
                    $timeout(function () {
                        $scope.cappdata = cappdata;

                        for (ann of cappdata.annotations)
                            $scope.dataCtrl.events.convertObject(ann);

                        if ($scope.dataCtrl.apis.video) $scope.api.refreshEventline();
                    }, 0);
                };

                cappdata.registerObserver(updateData);

                /**
                 * Generates curves for the example output in the graph
                 * @return {Object} The curves with titles and color
                 */
                var sinAndCos = function () {
                    var sin = [], sin2 = [],
                        cos = [];

                    //Data is represented as an array of {x,y} pairs.
                    for (var i = 0; i < 100; i++) {
                        sin.push({x: i, y: Math.sin(i/10)});
                        sin2.push({x: i, y: i % 10 == 5 ? null : Math.sin(i/10) * 0.25 + 0.5});
                        cos.push({x: i, y: .5 * Math.cos(i/10 + 2) + Math.random() / 10});
                    }

                    //Line chart data should be sent as an array of series objects.
                    return [
                        {
                            values: sin,      //values - represents the array of {x,y} data points
                            key: 'Sine Wave', //key  - the name of the series.
                            color: '#ff7f0e'  //color - optional: choose your own line color.
                        },
                        {
                            values: cos,
                            key: 'Cosine Wave',
                            color: '#2ca02c'
                        },
                        {
                            values: sin2,
                            key: 'Another sine wave',
                            color: '#7777ff',
                            area: true      // area - set to true if you want this line to turn into a filled area chart.
                        }
                    ];
                };

                /**
                 * Curve generator made for Camomile Demonstration
                 * @return {Array} Array containing one curve
                 */
                var curvePerso = function () {
                    var curve = [];

                    for (var i = 1; i <= 50; i++) {
                        curve.push({x: i, y: Math.abs(Math.cos(i) + Math.random() * 5) + 1});
                    }

                    return [{
                        values: curve,
                        key: 'Curve for Camomile',
                        color: '#07f',
                        area: true
                    }];
                };

                /**
                 * Graph options
                 * @type {Object}
                 */
                $scope.graph = {
                    options: {
                        chart: {
                            type: 'lineChart',
                            height: 450,
                            margin : {
                                top: 20,
                                right: 20,
                                bottom: 40,
                                left: 55
                            },
                            x: function(d) { return d.x; },
                            y: function(d) { return d.y; },
                            useInteractiveGuideline: true,
                            dispatch: {
                                stateChange: function(e) { console.log("stateChange"); },
                                changeState: function(e) { console.log("changeState"); },
                                tooltipShow: function(e) { console.log("tooltipShow"); },
                                tooltipHide: function(e) { console.log("tooltipHide"); }
                            },
                            xAxis: {
                                axisLabel: 'Time (ms)'
                            },
                            yAxis: {
                                axisLabel: 'Voltage (v)',
                                tickFormat: function(d) {
                                    return d3.format('.02f')(d);
                                },
                                axisLabelDistance: -10
                            },
                            callback: function(chart) {
                                console.log("!!! lineChart callback !!!");
                            }
                        },
                        title: {
                            enable: false,
                            text: 'Title for Line Chart'
                        },
                        subtitle: {
                            enable: false,
                            text: 'Subtitle for simple line chart. Lorem ipsum dolor sit amet, at eam blandit sadipscing, vim adhuc sanctus disputando ex, cu usu affert alienum urbanitas.',
                            css: {
                                'text-align': 'center',
                                'margin': '10px 13px 0px 7px'
                            }
                        },
                        caption: {
                            enable: false,
                            html: '<b>Figure 1.</b> Lorem ipsum dolor sit amet, at eam blandit sadipscing, <span style="text-decoration: underline;">vim adhuc sanctus disputando ex</span>, cu usu affert alienum urbanitas. <i>Cum in purto erat, mea ne nominavi persecuti reformidans.</i> Docendi blandit abhorreant ea has, minim tantas alterum pro eu. <span style="color: darkred;">Exerci graeci ad vix, elit tacimates ea duo</span>. Id mel eruditi fuisset. Stet vidit patrioque in pro, eum ex veri verterem abhorreant, id unum oportere intellegam nec<sup>[1, <a href="https://github.com/krispo/angular-nvd3" target="_blank">2</a>, 3]</sup>.',
                            css: {
                                'text-align': 'justify',
                                'margin': '10px 13px 0px 7px'
                            }
                        }
                    },
                    data: curvePerso()
                };

                $scope.graphCallback = function(scope, element) {
                    $scope.graphAPI = scope.api;
                };

                $scope.api.updateTimebar = function () {
                    // Calculate the margin left needed to follow the slider position
                    let vt = $scope.dataCtrl.apis.video.API; // vt for videoTime
                    let ref = (vt.currentTime / vt.totalTime) * ($scope.dimensions.res.width);
                    $scope.timebarClass = {
                        "margin-left": ref + 'px',
                        "height": $scope.dimensions.div.height // Same height as its parent - 40
                    };
                };

                $scope.api.refreshEventline = function () {
                    let vt = $scope.dataCtrl.apis.video.API; // vt for videoTime
                    if ($scope.dimensions)
                        for (e of $scope.dataCtrl.events.getEvents()) {
                            let time = (e.fragment.begin / vt.totalTime) * ($scope.dimensions.res.width);
                            let end = ((e.fragment.end - e.fragment.begin) / vt.totalTime) * ($scope.dimensions.res.width);
                            e.setDataField("style", {
                                'margin-left': time,
                                'width': end,
                                'background-color': e.getDataField('color')
                            });
                            if (!vt.totalTime) {
                                e.style.display = "none";
                            }
                        }
                };

                $scope.api.getEvents = function () {
                    $scope.dataCtrl.events.refreshEvents();
                };

                $scope.beginEvent = function () {
                    if (!$scope.recordingEvent) {
                        console.log("Beginning the event");
                        $scope.recordingEvent = true;
                        $scope.dataCtrl.events.newEvent();
                        var le = $scope.dataCtrl.events.getLastEvent();
                        le.setFragmentField("begin", $scope.dataCtrl.apis.video.API.currentTime);
                        le.setDataField("text", "Testing");
                        $scope.eventInterval = $interval(function () {
                            le.setFragmentField("end", $scope.dataCtrl.apis.video.API.currentTime);
                            $scope.api.refreshEventline();
                        }, 250);
                    }
                };

                $scope.endEvent = function () {
                    if ($scope.recordingEvent) {
                        console.log("Ending the event");
                        $scope.recordingEvent = false;
                        $interval.cancel($scope.eventInterval);
                        //console.log($scope.dataCtrl.events.getEvents());
                        $scope.saveSegment($scope.dataCtrl.events.getLastEvent());
                    }
                };

                $scope.editSegment = function (event) {
                    $scope.stopInterval();
                    $scope.dataCtrl.apis.video.videoPause();

                    var modalInstance = $uibModal.open({
                        animation: true,
                        templateUrl: 'app/shared/modal/editSegment.html',
                        controller: 'EditSegmentCtrl',
                        size: 'md',
                        resolve: {
                            event: function () {
                                return event;
                            }
                        }
                    });

                    modalInstance.result.then(function (event) {
                        //$scope.selected = selectedItem;
                        $scope.saveSegment(event);
                        $scope.launchInterval();
                    }, function () {
                        $log.info('Modal dismissed at: ' + new Date());
                        $scope.launchInterval();
                    });
                };

                $scope.saveSegment = function (event) {
                    let a = $scope.dataCtrl.api.infos;
                    if (a.layer && a.medium) {
                        event.save();
                    }

                };
            },
            link: function (scope, elem, attrs, controllerInstance) {
                scope.dataCtrl = controllerInstance;

                scope.launchInterval = function () {
                    if (!scope.interval) scope.interval = [];
                    scope.interval.push($interval(function () {
                        scope.api.updateTimebar();
                        scope.api.refreshEventline();
                    }, 250));
                };

                scope.stopInterval = function () {
                    for (i of scope.interval) {
                        $interval.cancel(i);
                    }
                };

                /*scope.$on('$destroy', function() {
                    $interval.cancel(scope.interval);
                });*/

                scope.api.refresh = function () {
                    let div = elem.find('div.details-display');
                    scope.dimensions = {};
                    scope.dimensions.div = {
                        width: div.width(),
                        height: div.height()
                    };
                    var eventLine = elem.find('event-div').find('div');
                    scope.dimensions.res = {
                        width: eventLine.width(),
                        height: eventLine.height()
                    };

                    if (scope.graph) scope.graphAPI.refresh();
                    if (scope.dataCtrl.apis.video) {
                        //if (scope.inter) scope.inter = undefined;
                        scope.launchInterval();
                        scope.$on('$destroy', function () {
                            console.log('Destroying details interval');
                            scope.stopInterval();
                        });
                    }
                    scope.updateData();
                };

                controllerInstance.apis.details = scope.api;
            }
        }
    })
    .directive('eventDiv', function () {
        return {
            template: '<div class="eventLine"></div>'
        }
    })
    .controller('EditSegmentCtrl', function ($scope, $uibModalInstance, event) {
        $scope.event = event;

        $scope.ok = function () {
            $uibModalInstance.close($scope.event);
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    })
    .filter('onlyPrimitives', function() {
        return function(x) {
            var i = {};
            for (c in x) {
                if (typeof x[c] != "object") {
                    i[c] = x[c];
                }
            }
            return i;
        };
    });
