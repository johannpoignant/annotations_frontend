/**
 * Module angular for camomileApp; declaring the video directive
 */
angular.module('camomileApp.video', [
  "ngSanitize",
  "com.2fdevs.videogular",
  "com.2fdevs.videogular.plugins.controls",
  "rzModule"
])
/**
 * Constant for this module
 * @return {undefined}
 */
.constant('camomileConfigVideo', {
  canvas: {
    fillColor: '#f00',
    strokeColor: '#f00'
  }
})
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
    }
  }
})
/**
 * Controller for the video directive
 * @param  {string} 'VideoCtrl'      Name of the controller
 * @param  {function} function($scope, $log,         $interval function executed
 * @return {undefined}
 */
.controller('VideoCtrl', function($scope, $log, $interval, camomileConfigVideo) {
  /**
   * API of the player
   * @type {Object}
   */
  $scope.API = undefined;

  /**
   * Math shortcut
   * @type {Object}
   */
  $scope.Math = window.Math;

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
  $scope.annotation.points = []; // Array of points
  $scope.annotation.drawStyle = "free"; // The drawing style (free, rectangles, circles....)

  // Canvas
  $scope.canvas = window.document.getElementById('transparent-plan');
  $scope.context = $scope.canvas.getContext('2d');
  $scope.context.strokeStyle = camomileConfigVideo.canvas.strokeColor;
  $scope.context.fillStyle = camomileConfigVideo.canvas.fillColor;

  /**
   * Used to setup the canvas on the video
   * @return {undefined}
   */
  $scope.setupCanvas = function() {
    $scope.clearCanvas();
    var points = $scope.annotation.points;
    if (points.length > 1) {
      $scope.context.beginPath();
      if ($scope.annotation.drawStyle == "rectangle") {
        var w = points[1].x - points[0].x, h = points[1].y - points[0].y;
        $scope.context.rect(points[0].x, points[0].y, w, h);
      } else if ($scope.annotation.drawStyle == "circle") {
        var m = $scope.Math;
        var r = m.abs(m.sqrt(m.pow(points[0].x - points[1].x, 2) + m.pow(points[0].y - points[1].y, 2)));
        $scope.context.arc(points[0].x, points[0].y, r, 0, 2 * Math.PI);
      } else if ($scope.annotation.drawStyle == "free") {
        $scope.context.moveTo(points[0].x, points[0].y);
        for (p of points.slice(1, points.length)) {
          $scope.context.lineTo(p.x, p.y);
        }
      }
      $scope.context.stroke();
      $scope.context.closePath();
    } else if (points.length == 1) {
      $scope.context.beginPath();
      $scope.context.arc(points[0].x, points[0].y, 1, 0, 2 * Math.PI);
      $scope.context.fill();
      $scope.context.closePath();
    }
  }

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
  }

  /**
   * Clears the canvas, and if clearPoints is provided and set to true, will
   * also empty the points array
   * @param {boolean} clearPoints
   * @return {undefined}
   */
  $scope.clearCanvas = function(clearPoints) {
    clearPoints = clearPoints !== undefined ? clearPoints : false;
    if (clearPoints) {
      $scope.annotation.points = [];
    }
    $scope.context.clearRect(0, 0, $scope.canvas.width, $scope.canvas.height);
  }

  $scope.setupCanvas(); // Initial setup of the canvas with the annotation from the server

  // Add a point on click on the canvas
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
   * Set up the interval for the synchronisation of the slider with the player
   */
  $interval(function() {
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
  }, 200);
});
