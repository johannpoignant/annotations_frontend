/**
 * Module angular for camomileApp; declaring the video directive
 */
angular.module('camomileApp.controllers.video', [
  "ngSanitize",
  "com.2fdevs.videogular",
  "com.2fdevs.videogular.plugins.controls",
  "rzModule",
  "ngAnimate",
  "nvd3"
])
/**
 * Directive to be used in your HTML. Simply import this module and use
 * the directive with <camomile-video src="yourVideoSrc"></camomile-video>
 * NOTE: your video must be trusted by $sce before sent here
 * @param  {string} 'camomileVideo' the directive name
 * @param  {function} function(
 * @return {Object}                 returns the directive
 */
.directive('camomileVideo', function() {
  return {
    templateUrl: 'views/video.html',
    restrict: 'E',
    scope: {
      src: '='
    },
    controller: function ($scope, $log, $interval, $timeout) {
      /**
       * JSON shortcut
       * @type {Object}
       */
      var JSON = window.JSON;

      /**
       * Math shortcut
       * @type {Object}
       */
      $scope.Math = window.Math;

      /**
       * Class used for the canvas
       * Using random generated int for identification
       * @type {String}
       */
      $scope.videoClass = "video-div-" + $scope.Math.floor($scope.Math.random() * 1000 + 1);

      /**
       * Dimensions of several object
       * @type {Object}
       */
      $scope.dimensions = {
        width: 0,
        height: 0,
        video: {
          width: 0,
          height: 0
        },
        others: {
          width: 0,
          height: 0
        }
      };

      /**
       * Sets the dimensions in the webpage
       * @return {undefined}
       */
      $scope.setStyles = function() {
        // If the styles are correct, don't update them
        if ($scope.dimensions.height == angular.element(document.querySelector('.' + $scope.videoClass))[0].offsetHeight) {
          return;
        }

        // Global dimensions
        $scope.dimensions.height = angular.element(document.querySelector('.' + $scope.videoClass))[0].offsetHeight;
        $scope.dimensions.width = angular.element(document.querySelector('.' + $scope.videoClass))[0].offsetWidth;

        // Video player dimensions
        $scope.dimensions.video.height = angular.element(document.querySelector('.' + $scope.videoClass + ' videogular'))[0].offsetHeight;
        $scope.dimensions.video.width = angular.element(document.querySelector('.' + $scope.videoClass + ' videogular'))[0].offsetWidth;

        // Controls and infos pannel dimensions
        $scope.dimensions.others.height = angular.element(document.querySelector('.' + $scope.videoClass + ' .others'))[0].offsetHeight;
        $scope.dimensions.others.width = angular.element(document.querySelector('.' + $scope.videoClass + ' .others'))[0].offsetWidth;

        $scope.graphAPI.refresh();
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

      $scope.buttons = [
        {
          img: 'icons/control.png',
          alt: 'Play',
          fun: $scope.videoPlay,
        }
      ];

      $scope.datastr = [
        {
          zdqzdq: 'zdq',
          zqd: 2
        },
        [
          {
            dzqzdqzdqqzd: 'zdq',
            trhph: 6
          }
        ]
      ];

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
        data: sinAndCos()
      };

      $scope.graphCallback = function(scope, element) {
        var api = scope.api;

        $scope.graphAPI = api;
      };

      // Initial empty object
      $scope.config = {};

      /**
       * Contains the configuration of the annotation module
       * @type {Object}
       */
      $scope.config.annotation = {
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
        strokeWidth: 2 // Stroke width (line width) choosen
      };

      /**
       * Utility for the little popup
       * @type {Object}
       */
      $scope.infMsg = {
        show: false, // Is it displayed?
        message: '' // The message stored
      };

      /**
       * Shows a message
       * @param  {string} message  the message to show
       * @param  {int} duration the duration to show it
       * @return {undefined}
       */
      $scope.showMessage = function(message, duration) {
        duration = duration === undefined ? 5000 : duration;
        $scope.infMsg.show = true;
        $scope.infMsg.message = message;
        $timeout(function() {
          $scope.infMsg.show = false;
        }, duration);
      };

      /**
       * An array containing all the events displayed on the eventLine
       * @type {Array}
       */
      $scope.events = [{begin: 20, duration: 20, text: "Test"}, {begin: 48, duration: 125, text: "Test 2"}];

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
      $scope.$watch($scope.events, function() {
        $log.log('Events changed!');
        $scope.loaded = true;
      });

      /**
       * Adds the event in the scope to the list of events displayed on the eventLine
       * @return {undefined}
       */
      $scope.addEvent = function() {
        if ($scope.event.begin && $scope.event.duration && $scope.event.text) {
          $scope.events.push(JSON.parse(JSON.stringify($scope.event)));
        }
      };

      /**
       * API of the player
       * @type {Object}
       */
      $scope.API = undefined;

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

      /**
       * Store the API of the player when it is ready
       * @param  {[type]} API [description]
       * @return {[type]}     [description]
       */
      $scope.onPlayerReady = function(API) {
        $scope.API = API;
      };

      /**
       * Alerts the timestamp
       * @return {undefined}
       */
      $scope.alertTimestamp = function() {
        window.alert($scope.API.currentTime);
      };

      /**
       * Plays the video
       * @return {undefined}
       */
      $scope.videoPlay = function() {
        $scope.API.play();
      };

      /**
       * Pauses the video
       * @return {undefined}
       */
      $scope.videoPause = function() {
        $scope.API.pause();
      };

      /**
       * Stops the video
       * @return {undefined}
       */
      $scope.videoStop = function() {
        $scope.API.pause();
        $scope.API.seekTime(100, true);
      };

      /**
       * Stops the video and sets the timeline at 0
       * @return {undefined}
       */
      $scope.videoBegin = function() {
        $scope.API.pause();
        $scope.API.seekTime(0, true);
      };

      /**
       * Stops the video and sets the timeline at the end
       * @return {undefined}
       */
      $scope.videoEnd = function() {
        $scope.API.pause();
        $scope.API.seekTime(100, true);
      };

      /**
       * Next frame on the video playing
       * @return {undefined}
       */
      $scope.nextFrame = function() {
        var ta = $scope.API.currentTime;
        $scope.API.seekTime(ta / 1000 + 1 / 25, false);
      };

      /**
       * Previous frame on the video playing
       * @return {undefined}
       */
      $scope.previousFrame = function() {
        var ta = $scope.API.currentTime;
        $scope.API.seekTime(ta / 1000 - 1 / 25, false);
      };

      /**
       * Next second on the video playing
       * @return {undefined}
       */
      $scope.nextSecond = function() {
        var ta = $scope.API.currentTime;
        $scope.API.seekTime(ta / 1000 + 1, false);
      };

      /**
       * Previous second on the video playing
       * @return {undefined}
       */
      $scope.previousSecond = function() {
        var ta = $scope.API.currentTime;
        $scope.API.seekTime(ta / 1000 - 1, false);
      };

      /**
       * Test method, use this for debug
       * @return {undefined}
       */
      $scope.testFrame = function() { // Use this as test button
        //$log.log($scope.API);
        //var tt = $scope.API.totalTime, ta = $scope.API.currentTime;
        // 1 sec = 100 / tt
        /*
          OBSOLETE
          EX: 1 sec sur une vidéo de 100s: 100 / 100: 1%
          1 / 25 sec : 100 / (1 / 25)
          Pour ajouter une frame, il faut transformer le temps actuel en %
          Ex: on est a 2s sur 10s: 2000 / 10000 + 100 / (1 / 25)
        */
        //$scope.API.seekTime(ta / tt + 100 / (1 / 25), true);
        //$scope.API.seekTime(0.05, true);
      };

      // Annotations
      $scope.annotation = {}; // The annotation object

      // Points
      $scope.annotations = [];
      $scope.annotation.name = ""; // The name of the annotation or whatever
      $scope.annotation.drawStyle = ''; // Declarative (doesn't do anything else)
      $scope.annotation.timestamp = 0; // The timestamp of the points (beginning time, in ms)
      $scope.annotation.duration = 2000; // The duration (in ms)
      $scope.annotation.points = []; // Array of points

      // Watcher to automatically change the value
      $scope.$watch("config.annotation.drawStyle", function() {
        $scope.annotation.drawStyle = $scope.config.annotation.drawStyle;
      });

      // Canvas
      $scope.canvas = window.document.getElementsByClassName('transparent-plan')[0];
      $scope.context = $scope.canvas.getContext('2d');
      $scope.$watch("config.annotation.strokeColor", function() {
        $scope.context.strokeStyle = $scope.config.annotation.strokeColor;
      });
      $scope.$watch("config.annotation.fillColor", function() {
        $scope.context.fillStyle = $scope.config.annotation.fillColor;
      });
      $scope.$watch("config.annotation.strokeWidth", function() {
        $scope.context.lineWidth = $scope.config.annotation.strokeWidth;
      });

      $scope.reloadAnnotationStyles = function() {
        $scope.context.strokeStyle = $scope.config.annotation.strokeColor;
        $scope.context.fillStyle = $scope.config.annotation.fillColor;
        $scope.context.lineWidth = $scope.config.annotation.strokeWidth;
      };

      /**
       * Draws the point p on the canvas
       * @param {Object} p the point containing the data of the point
       * @return {undefined}
       */
      var drawPoint = function(p) {
        if (p.points.length > 1) {
          $scope.context.beginPath();
          if (p.drawStyle == "rectangle") {
            drawRectangle(p.points);
          } else if (p.drawStyle == "circle") {
            drawCircle(p.points);
          } else if ($scope.annotation.drawStyle == "free") {
            drawFree(p.points);
          }
          $scope.context.stroke();
          $scope.context.closePath();
        } else if (p.points.length == 1) {
          $scope.context.beginPath();
          $scope.context.arc(p.points[0].x, p.points[0].y, 1, 0, 2 * Math.PI);
          $scope.context.fill();
          $scope.context.closePath();
        }
      }

      /**
       * Draws a rectangle
       * @param  {Array} r the points
       * @return {undefined}
       */
      var drawRectangle = function(r) {
        let w = r[1].x - r[0].x, h = r[1].y - r[0].y;
        $scope.context.rect(r[0].x, r[0].y, w, h);
      };

      /**
       * Draws a circle
       * @param  {Array} c the points
       * @return {undefined}
       */
      var drawCircle = function(c) {
        let m = $scope.Math; // Math js lib
        // Radius
        let r = m.abs(m.sqrt(m.pow(c[0].x - c[1].x, 2) + m.pow(c[0].y - c[1].y, 2)));
        $scope.context.arc(c[0].x, c[0].y, r, 0, 2 * Math.PI);
      };

      /**
       * Draws a free shape
       * @param  {Array} f the points
       * @return {undefined}
       */
      var drawFree = function(f) {
        $scope.context.moveTo(f[0].x, f[0].y); // We move to the first point
        for (p of f.slice(1, f.length)) {
          $scope.context.lineTo(p.x, p.y); // And we draw a line to each point
        }
      };

      /**
       * Used to setup the canvas on the video
       * @return {undefined}
       */
      $scope.setupCanvas = function() {
        $scope.clearCanvas();
        $scope.reloadAnnotationStyles();

        if ($scope.API) {
          let time = $scope.API.currentTime;
          for (a of $scope.annotations) {
            if (time >= a.timestamp && time <= a.timestamp + a.duration) {
              drawPoint(a);
            }
          }

          drawPoint($scope.annotation);
        }
      };

      /**
       * Allow to know if the current drawing has reached the maximum of points it
       * can have
       * @return {boolean} true if the drawing has reached the max. of points it can
       * have, false otherwise
       */
      $scope.annotation.isComplete = function() {
        if ($scope.annotation.drawStyle == "rectangle" && $scope.annotation.points.length > 1)
          return true;
        else if ($scope.annotation.drawStyle == "circle" && $scope.annotation.points.length > 1)
          return true;
        else if ($scope.annotation.drawStyle == "free" && $scope.annotation.points.length > 9)
          return true;
        else
          return false;
      };

      /**
       * Saves the annotation into the annotations array
       * @return {undefined}
       */
      $scope.saveAnnotation = function() {
        if ($scope.annotation.points.length > 1 && $scope.annotation.name != "") {
          $scope.annotation.timestamp = $scope.API.currentTime;
          $scope.annotations.push(JSON.parse(JSON.stringify($scope.annotation)));
          $scope.clearCanvas(true);

          $scope.showMessage("Saved annotation!");
        }
      };

      /**
       * Clears the canvas, and if clearPoints is provided and set to true, will
       * also empty the points array
       * @param {boolean} clearPoints
       * @return {undefined}
       */
      $scope.clearCanvas = function(clearPoints) {
        clearPoints = clearPoints !== undefined ? clearPoints : false;
        if (clearPoints) {
          resetAnnotation();
        }
        $scope.context.clearRect(0, 0, $scope.canvas.width, $scope.canvas.height);
      };

      /**
       * Resets the annotation
       * @return {undefined}
       */
      var resetAnnotation = function() {
        $scope.annotation.points = [];
        $scope.annotation.name = "";
        $scope.annotation.duration = 2000;
        $scope.annotation.timestamp = 0;
      }

      $scope.setupCanvas(); // Initial setup of the canvas with the annotation from the server

      /**
       * Adds a point on click on the canvas
       * @param {unknown} event js object
       * @return {undefined}
       */
      $scope.addOnClick = function(event) {
        var x = event.offsetX;
        var y = event.offsetY;

        if (!$scope.annotation.isComplete()) {
          $scope.annotation.points.push({
            x: x,
            y: y
          });
        }

        $scope.setupCanvas();
      };

      /**
       * Interval used to set the styles each second.
       * @return {interval}
       */
      $scope.intervalStyle = $interval(function () {
        $scope.setStyles();
      }, 1000);

      $scope.$on("$destroy", function() {
        $interval.cancel($scope.intervalStyle);
      });

      /**
       * Set up the interval for the synchronisation of the slider with the player
       */
      $scope.sliderSync = $interval(function() {
        if ($scope.API) {
          var nval = $scope.slider.value, lastVal = $scope.slider.lastValue;
          if (nval != lastVal) {
            $scope.API.seekTime($scope.slider.value, false);
          } else {
            $scope.slider.value = $scope.Math.floor($scope.API.currentTime / 1000);
          }

          if (!$scope.slider.options.ceil) {
            $scope.slider.options.ceil = $scope.Math.floor($scope.API.totalTime / 1000);
          }
        }
        $scope.slider.lastValue = $scope.slider.value;

        // Calculate the margin left needed to follow the slider position
        let ref = $scope.slider.value / $scope.Math.floor($scope.API.totalTime / 1000) * ($scope.dimensions.width - 32);
        $scope.timebar = {
          "margin-left": ref + 'px',
          "height": $scope.dimensions.others.height // Same height as its parent
        }

        $scope.setupCanvas();
      }, 100);

      $scope.$on("$destroy", function() {
        $interval.cancel($scope.sliderSync);
      });
    }
  }
});
