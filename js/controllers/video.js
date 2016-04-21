angular.module('camomileApp.video', [
  "ngSanitize",
  "com.2fdevs.videogular",
  "com.2fdevs.videogular.plugins.controls",
  "rzModule"
]).directive('camomileVideo', function() {
  return {
    templateUrl: 'views/video.html',
    restrict: 'E',
    scope: {
      src: '='
    }
  }
}).controller('VideoCtrl', function($scope, $sce, $log, $interval) {
  // Video player API
  $scope.API = undefined;
  $scope.Math = window.Math;

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

  // Methods corresponding
  $scope.onPlayerReady = function(API) {
    $scope.API = API;
  };
  $scope.alertTimestamp = function() {
    window.alert($scope.API.currentTime);
  };
  $scope.videoPlay = function() {
    $scope.API.play();
  };
  $scope.videoPause = function() {
    $scope.API.pause();
  };
  $scope.videoStop = function() {
    $scope.API.pause();
    $scope.API.seekTime(100, true);
  };
  $scope.videoBegin = function() {
    $scope.API.pause();
    $scope.API.seekTime(100, true);
  };
  $scope.videoEnd = function() {
    $scope.API.pause();
    $scope.API.seekTime(0, true);
  };
  $scope.nextFrame = function() {
    var ta = $scope.API.currentTime;
    $scope.API.seekTime(ta / 1000 + 1 / 25, false);
  };
  $scope.previousFrame = function() {
    var ta = $scope.API.currentTime;
    $scope.API.seekTime(ta / 1000 - 1 / 25, false);
  };
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
  $scope.annotation.visible = false; // Is the annotation visible?

  // Points
  $scope.annotation.points = []; // Array of points
  $scope.annotation.drawStyle = "free"; // The drawing style (free, rectangles, circles....)

  // Canvas
  $scope.canvas = window.document.getElementById('transparent-plan');
  $scope.context = $scope.canvas.getContext('2d');
  $scope.context.strokeStyle = "#f00"; // COULEUR DU TRAIT
  $scope.context.fillStyle = "#f00"; // COULEUR DU FILL

  // Setup the canvas, using the points from the annotation object in this scope
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

  // Clears the canvas, and if clearPoints is provided and set to true, will also empty the points array
  $scope.clearCanvas = function(clearPoints) {
    clearPoints = clearPoints !== undefined ? clearPoints : false;
    if (clearPoints) {
      $scope.annotation.points = [];
    }
    $scope.context.clearRect(0, 0, $scope.canvas.width, $scope.canvas.height);
  }

  $scope.setupCanvas(); // Initial setup of the canvas with the annotation from the server

  // Add a point on click on the canvas
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
