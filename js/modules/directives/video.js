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
.constant('camomileToolsConfig', {
  refreshTime: {
    canvas: 250,
    video: 100,
    dimensions: 1000
  }
})
/*
██████   ██████  ██   ██
██   ██ ██    ██  ██ ██
██████  ██    ██   ███
██   ██ ██    ██  ██ ██
██████   ██████  ██   ██
*/
.directive('camomileBox', function ($interval, $timeout, camomileToolsConfig) {
  return {
    restrict: 'AE',
    scope: {
      infos: '@' // Needed: id_layer, id_medium in {layer: '', medium: ''}
    },
    transclude: true,
    template: '<div ng-transclude></div>' +
    '<div class="inf-msg" ng-show="infMsg.show">' +
    '<b>Message:</b> {{infMsg.message}}' +
    '</div>',
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
      facto.video = {
        currentTime: 0,
        totalTime: 0
      };
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
          for (d in $scope.annotations) {
            delete $scope.annotations[d];
          }
          $scope.annotations.length = 0;
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
        } else {
          console.warn('No media available.');
        }
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
      $scope.showMessage = this.showMessage = function(message, duration) {
        duration = duration === undefined ? 5000 : duration;
        $scope.infMsg.show = true;
        $scope.infMsg.message = message;
        $timeout(function() {
          $scope.infMsg.show = false;
        }, duration);
      };

    },
    link: function (scope, elem, attrs) {
      scope.interval = $interval(function () {
        scope.dimensions = {
          width: elem.find('div').width(),
          height: elem.find('div').height()
        };
        if (  !scope.lastDimensions
            || scope.dimensions.width != scope.lastDimensions.width
            || scope.dimensions.height != scope.lastDimensions.height) {
              // Trigger fns
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
        console.log("Destroying");
        $interval.cancel(scope.interval);
      });
    }
  }
})
/*
 ██████  █████  ███    ██ ██    ██  █████  ███████
██      ██   ██ ████   ██ ██    ██ ██   ██ ██
██      ███████ ██ ██  ██ ██    ██ ███████ ███████
██      ██   ██ ██  ██ ██  ██  ██  ██   ██      ██
 ██████ ██   ██ ██   ████   ████   ██   ██ ███████
*/
.directive('camomileCanvas', function ($interval, camomileData, camomileToolsConfig) {
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
})
/*
██ ███    ███  █████   ██████  ███████
██ ████  ████ ██   ██ ██       ██
██ ██ ████ ██ ███████ ██   ███ █████
██ ██  ██  ██ ██   ██ ██    ██ ██
██ ██      ██ ██   ██  ██████  ███████
*/
.directive('camomileImage', function ($interval, camomileData, camomileToolsConfig) {
  return {
    restrict: 'AE',
    template: '<img ng-src="{{src}}" ng-style="style">',
    require: '^camomileBox',
    scope: {
      src: '@'
    },
    controller: function ($scope) {
      // Vide
      $scope.api = {};
      $scope.api.image = {};
      $scope.style = {
        width: "100%",
        height: "100%"
      };
    },
    link: function (scope, elem, attrs, controllerInstance) {
      scope.dataCtrl = controllerInstance;

      scope.api.refresh = function () {
        scope.api.dimensions = {
          width: elem.find('img').width(),
          height: elem.find('img').height()
        };
        if (scope.dataCtrl.apis.canvas)
          scope.dataCtrl.apis.canvas.refresh();
      };

      controllerInstance.apis.image = scope.api;
      controllerInstance.apis.video = undefined;
    }
  }
})
/*
██    ██ ██ ██████  ███████  ██████
██    ██ ██ ██   ██ ██      ██    ██
██    ██ ██ ██   ██ █████   ██    ██
 ██  ██  ██ ██   ██ ██      ██    ██
  ████   ██ ██████  ███████  ██████
*/
.directive('camomileVideo', function ($interval, camomileData, camomileToolsConfig) {
  return {
    restrict: 'AE',
    templateUrl: 'views/cVideo.html',
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
        $scope.video.updateSlider();
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
       * Test method, use this for debug
       * @return {undefined}
       */
      $scope.video.testFrame = function () { // Use this as test button
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

        scope.elem
          .find('video-control button')
          .css('width', window.Math.floor(1 / nb * scope.video.dimensions.width) + 'px');

        if (scope.dataCtrl.apis.canvas)
          scope.dataCtrl.apis.canvas.refresh();

        scope.interval = $interval(function () {
          if (scope.video.getStatus() == "play") {
            scope.video.updateTime();
          }
        }, 100);

        scope.$on('$destroy', function() {
          console.log("Destroying");
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
})
/*
██████  ███████ ████████  █████  ██ ██      ███████
██   ██ ██         ██    ██   ██ ██ ██      ██
██   ██ █████      ██    ███████ ██ ██      ███████
██   ██ ██         ██    ██   ██ ██ ██           ██
██████  ███████    ██    ██   ██ ██ ███████ ███████
*/
.directive('camomileDetails', function ($log, $interval, $timeout, camomileData, camomileToolsConfig) {
  return {
    restrict: 'AE',
    templateUrl: 'views/cDetails.html',
    require: '^camomileBox',
    scope: {
      data: '@'
    },
    controller: function ($scope) {
      $scope.api = {};

      /**
       * An array containing all the events displayed on the eventLine
       * @type {Array}
       */
      $scope.events = [{begin: 10, duration: 10, text: "Test"}, {begin: 48, duration: 125, text: "Test 2"}];

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
       * @return {undefined}
       */
      $scope.addEvent = function() {
        if ($scope.event.begin && $scope.event.duration && $scope.event.text) {
          $scope.events.push(JSON.parse(JSON.stringify($scope.event)));
        }
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
          "height": $scope.dimensions.div.height - 40 // Same height as its parent - 40
        };
      };

      $scope.api.refreshEventline = function () {
        let vt = $scope.dataCtrl.facto.video; // vt for videoTime
        for (e of $scope.events) {
          let time = (e.begin / vt.totalTime) * ($scope.dimensions.res.width);
          let end = (e.duration / vt.totalTime) * ($scope.dimensions.res.width);
          e.style = {
            'margin-left': time + 'px',
            'width': end
          };
        }
      };
    },
    link: function (scope, elem, attrs, controllerInstance) {
      scope.dataCtrl = controllerInstance;

      scope.api.refresh = function () {
        scope.dimensions = {};
        scope.dimensions.div = {
          width: elem.width(),
          height: elem.height()
        };
        var eventLine = angular.element(elem.find('event-div'));
        scope.dimensions.res = {
          width: eventLine.width(),
          height: eventLine.height()
        };

        scope.api.updateTimebar();
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
})
/*
███████ ██████  ██ ████████
██      ██   ██ ██    ██
█████   ██   ██ ██    ██
██      ██   ██ ██    ██
███████ ██████  ██    ██
*/

.directive('camomileAnnotations', function ($interval, Camomile) {
  return {
    restrict: 'AE',
    templateUrl: 'views/cAnnotationEdit.html',
    require: '^camomileBox',
    scope: {
      data: '@'
    },
    controller: function ($scope) {
      $scope.api = {};

      $scope.api.sendAnnotations = function () {
        var i = $scope.dataCtrl.infos();
        if (!i.layer || !i.medium) {
          console.warn('Pas de layer ou medium sélectionné');
          return;
        }
        var callback = function (err, data) {
          if (err) {
            console.warn('Save annotation fail');
          } else {
            console.info('Save annotation succeeded');
            $scope.api.getAnnotations();
          }
        };

        var sa = [];
        for (a of $scope.dataCtrl.facto.annotations) {
          if (a.id == 0) {
            delete a['$$hashKey'];

            sa.push({
              id_medium: i.medium,
              fragment: a.fragment,
              data: a.fragment.name
            });
          }
        }

        if (sa.length) {
          Camomile.createAnnotations(i.layer, sa, callback);
        }
      };

      $scope.api.getAnnotations = function () {
        if ($scope.dataCtrl.infos) {
          var i = $scope.dataCtrl.infos();

          if (i.layer && i.medium) {
            var ans = [];
            Camomile.getAnnotations(function (err, data) {
              if (err) {
                console.warn('Error in retrieving of annotations data');
              } else {
                for (obj of data) { // We push every fragment to recreate the array
                  ans.push({fragment: obj.fragment, id: obj._id});
                }
              }

              $scope.dataCtrl.setAnnotations(ans);
            }, {
              'filter': {
                id_layer: i.layer,
                id_medium: i.medium
              }
            });
          } else {
            console.warn('Infos non complètes');
          }
        } else {
          console.warn('Infos non dispos');
        }
      };

      $scope.api.deleteAnnotation = function (annotation) {
        if (annotation.id) {
          Camomile.deleteAnnotation(annotation.id, function (err, data) {
            if (err) {
              console.warn('Delete failed.');
            } else {
              $scope.api.getAnnotations();
            }
          });
        } else {
          let t = $scope.dataCtrl.facto.annotations;
          let p = t.indexOf(annotation);
          if (p !== -1) {
            t.splice(p, 1);
          }
        }
      };

      $scope.initWatchers = function () {
        $scope.$watch("dataCtrl.facto.config.drawStyle", function () {
          console.log('Draw style changed to ' + $scope.dataCtrl.facto.config.drawStyle);
          $scope.dataCtrl.facto.annotation.fragment.drawStyle = $scope.dataCtrl.facto.config.drawStyle;
        });
        $scope.$watch("dataCtrl.facto.config.strokeColor", function () {
          console.log('Stroke color changed to ' + $scope.dataCtrl.facto.config.strokeColor);
        });
        $scope.$watch("dataCtrl.facto.config.strokeWidth", function () {
          console.log('Stroke width changed to ' + $scope.dataCtrl.facto.config.strokeWidth);
        });
      }
    },
    link: function (scope, elem, attrs, controllerInstance) {
      scope.dataCtrl = controllerInstance;
      controllerInstance.apis.edit = scope.api;

      scope.initWatchers();
    }
  }
})
.factory('camomileData', function () {
  var facto = {};
  return facto;
});
