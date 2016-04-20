angular.module('camomileApp.controllers.browse', [
    "ngSanitize",
    "com.2fdevs.videogular",
    "com.2fdevs.videogular.plugins.controls",
  ])
  .controller('BrowseCtrl', ['$scope', '$sce', 'Camomile', '$log', '$window', '$timeout',
                    function ($scope, $sce, Camomile, $log, $window, $timeout) {
    $scope.Math = window.Math;

    // Video player API
    $scope.API = null;

    // Methods corresponding
    $scope.onPlayerReady = function(API) {
      $scope.API = API;
    }
    $scope.alertTimestamp = function() {
      $window.alert($scope.API.currentTime);
    }
    $scope.videoBegin = function() {
      $scope.API.pause();
      $scope.API.seekTime(100, true);
    }
    $scope.videoEnd = function() {
      $scope.API.pause();
      $scope.API.seekTime(0, true);
    }
    $scope.nextFrame = function() {
      //$scope.API.seekTime($scope.Math.floor($scope.API.currentTime / 1000) + 1, false);
      // $scope.API.play();
      // $timeout(function() {
      //   $scope.API.pause();
      // }, (1 / 25));
      var ta = $scope.API.currentTime;
      $scope.API.seekTime(ta / 1000 + 1 / 25, false);
    }
    $scope.previousFrame = function() {
      $scope.API.play();
      $timeout(function() {
        $scope.API.pause();
      }, (1 / 25));
    }
    $scope.testFrame = function() {
      $log.log($scope.API);
      var tt = $scope.API.totalTime, ta = $scope.API.currentTime;
      // 1 sec = 100 / tt
      /*
        EX: 1 sec sur une vidéo de 100s: 100 / 100: 1%
        1 / 25 sec : 100 / (1 / 25)
        Pour ajouter une frame, il faut transformer le temps actuel en %
        Ex: on est a 2s sur 10s: 2000 / 10000 + 100 / (1 / 25)
      */
      //$scope.API.seekTime(ta / tt + 100 / (1 / 25), true);
      $scope.API.seekTime(0.05, true);
    }

    // Annotations
    $scope.annotation = {};
    $scope.annotation.visible = false;

    // Points
    $scope.annotation.points = [];

    $scope.addOnClick = function(event) {
      var x = event.offsetX;
      var y = event.offsetY;
      $scope.annotation.points.push({
        x: x,
        y: y
      });

      for (var p of $scope.annotation.points) {
        $log.log("Point found at " + p.x + "; " + p.y);
      }
    }

    // browsing stauts
    $scope.browse = {};

    // list of corpora available to the user currently logged in
    $scope.browse.corpora = [];
    // selected corpus
    $scope.browse.corpus = undefined;
    // list of media in selected corpus
    $scope.browse.media = [];
    // selected medium
    $scope.browse.medium = undefined;
    // its sources
    $scope.browse.mediumSrc = undefined;
    // list of layers in selected corpus
    $scope.browse.layers = [];
    // selected layer
    $scope.browse.layer = undefined;

    // update list of corpora
    var getCorpora = function () {
      Camomile.getCorpora(function (err, data) {
        var corpora;
        if (err) {
          corpora = [];
        } else {
          corpora = data;
        }

        $timeout(function() {
          $scope.browse.corpora = corpora;
        }, 0);
      });
    };

    // update list of media
    var getMedia = function () {
      Camomile.getMedia(function (err, data) {
        var media;
        if (err) {
          media = [];
        } else {
          media = data;
        }

        // nested in $scope.$apply to make sure a change event is triggered
        // for (var i = 0; i < media.length; i++) {
        //   var val = media[i];
        //   media[i] = [
        //     val,
        //     [{
        //       src: $sce.trustAsResourceUrl(Camomile.getMediumURL(val, "mp4")),
        //       type: "video/mp4"
        //     }, {
        //       src: $sce.trustAsResourceUrl(Camomile.getMediumURL(val, "ogg")),
        //       type: "video/ogg"
        //     }],
        //     i
        //   ];
        // }
        // $log.log(media[1]);

        $scope.$apply(function () {
          $scope.browse.media = media;
        });

        // for (var d of $scope.browse.media) {
        //   $log.log(d);
        // }
      }, {
        'filter': {
          'id_corpus': $scope.browse.corpus
        }
      });
    };

    // update list of layers
    var getLayers = function () {
      Camomile.getLayers(function (err, data) {
        var layers;
        if (err) {
          layers = [];
        } else {
          layers = data;
        }
        // nested in $scope.$apply to make sure a change event is triggered
        $scope.$apply(function () {
          $scope.browse.layers = layers;
        });
      }, {
        'filter': {
          'id_corpus': $scope.browse.corpus
        }
      });
    };

    // get corpora on load
    getCorpora();
    // make sure to update corpora on login/logout
    // as different users have access to different corpora
    $scope.$parent.onLogInOrOut(getCorpora);

    // update list of media and layers when selected corpus changes
    $scope.$watch('browse.corpus', function () {
      if ($scope.browse.corpus) {
        getMedia();
        getLayers();
      }
    });

    $scope.$watch('browse.medium', function () {
      if ($scope.browse.medium) {
        $scope.browse.mediumSrc = [{
          src: $sce.trustAsResourceUrl(Camomile.getMediumURL($scope.browse.medium, "mp4")),
          type: "video/mp4"
        }, {
          src: $sce.trustAsResourceUrl(Camomile.getMediumURL($scope.browse.medium, "ogg")),
          type: "video/ogg"
        }];
      }
    });
  }]);
