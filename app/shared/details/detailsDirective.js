angular.module('camomileApp.directives.details', [
    "nvd3"
])
    .directive('camomileDetails', function ($log, $interval, $timeout, camomileToolsConfig) {
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

                /**
                 * An array containing all the events displayed on the eventLine
                 * @type {Array}
                 */
                //$scope.events = [{begin: 5, duration: 4, text: "Test"}, {begin: 12, duration: 6, text: "Test 2"}];
                $scope.events = [];

                $scope.index = 0;

                /**
                 * The local event var. Contain temporary informations
                 * @type {Object}
                 */
                $scope.event = {
                    begin: 0,
                    end: 0,
                    text: ""
                };

                /**
                 * Watcher on $scope.event; exec function when the events array changed
                 * @param  {Array} $scope.events the events Array
                 * @param  {function} function(     the function to be executed when a change
                 * is made (the watcher will automatically trigger it)
                 * @return {undefined}
                 */
                $scope.$watch("events", function() {
                    $log.log('Events changed!');
                    $scope.loaded = true;
                });

                /**
                 * Adds the event in the scope to the list of events displayed on the eventLine
                 * event.begin >= 0
                 * event.duration >= 0
                 * event.text > 0 && event.text < 16 (1-15)
                 * @return {undefined}
                 */
                $scope.api.addEvent = function(begin, duration, text) {
                    console.log(text.length);
                    if (begin >= 0
                        && duration >= 0
                        && text.length < 16) {
                        $scope.events.push({begin: begin, duration: duration, text: text, index: $scope.index});
                        $scope.index += 1;
                    }
                };

                $scope.api.getLastEvent = function () {
                    return $scope.events[$scope.index - 1];
                };

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
                    var api = scope.api;

                    $scope.graphAPI = api;
                };

                $scope.api.updateTimebar = function () {
                    // Calculate the margin left needed to follow the slider position
                    let vt = $scope.dataCtrl.facto.video; // vt for videoTime
                    let ref = (vt.currentTime / vt.totalTime) * ($scope.dimensions.res.width);
                    $scope.timebarClass = {
                        "margin-left": ref + 'px',
                        "height": $scope.dimensions.div.height // Same height as its parent - 40
                    };
                };

                $scope.api.refreshEventline = function () {
                    let vt = $scope.dataCtrl.apis.video.API; // vt for videoTime
                    for (e of $scope.events) {
                        let time = (e.begin / vt.totalTime) * ($scope.dimensions.res.width);
                        let end = (e.duration / vt.totalTime) * ($scope.dimensions.res.width);
                        e.style = {
                            'margin-left': time + 'px',
                            'width': end
                        };
                        if (!vt.totalTime) {
                            e.style.display = "none";
                        }
                    }
                };
            },
            link: function (scope, elem, attrs, controllerInstance) {
                scope.dataCtrl = controllerInstance;

                scope.api.refresh = function () {
                    let div = elem.find('div');
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

                    scope.api.updateTimebar();
                    scope.api.refreshEventline();
                    scope.graphAPI.refresh();
                };

                controllerInstance.apis.details = scope.api;
            }
        }
    })
    .directive('eventDiv', function () {
        return {
            template: '<div class="eventLine"></div>'
        }
    });
