angular.module('camomileApp.controllers.browse', [
    "ngSanitize",
    "com.2fdevs.videogular",
    "com.2fdevs.videogular.plugins.controls",
    "camomileApp.controllers.video"
  ])
  .controller('BrowseCtrl', ['$scope', '$sce', 'Camomile', '$log', '$window', '$timeout',
                    function ($scope, $sce, Camomile, $log, $window, $timeout) {
    $scope.Math = window.Math;

    $scope.loaded = false;

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

    $scope.mediaTypes = [
      'video',
      'image'
    ];

    $scope.mediaType = 'video';

    $scope.mediaExts = {
      image: [
        'JPG',
        'PNG'
      ],
      video: [
        'MP4',
        'WEBM',
        'OTG'
      ]
    };

    $scope.mediaExt = undefined;

    $scope.infos = {};

    // update list of corpora
    var getCorpora = function () {
      Camomile.getCorpora(function (err, data) {
        var corpora;
        if (err) {
          corpora = [];
        } else {
          corpora = data;
          $scope.loaded = true;
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

    $scope.$watch('mediaExt', function () {
      $scope.reloadMedium();
    });

    $scope.$watch('browse.medium', function () {
      $scope.reloadMedium();
    });

    $scope.reloadMedium = function () {
      // Try to get the url
      if ($scope.browse.medium && $scope.mediaExt) {
        $scope.infos.medium = $scope.browse.medium;
        // var url = Camomile.getMediumURL($scope.browse.medium, $scope.mediaExt);
        if ($scope.mediaType === "video") {
          $scope.audioExt = "ogg";
          $scope.browse.mediumSrc = [{
            src: $sce.trustAsResourceUrl(Camomile.getMediumURL($scope.browse.medium, $scope.mediaExt)),
            type: "video/" + $scope.mediaExt
          }, {
            src: $sce.trustAsResourceUrl(Camomile.getMediumURL($scope.browse.medium, $scope.audioExt)),
            type: "video/" + $scope.audioExt
          }];
        } else {
          $scope.browse.mediumSrc = $sce.trustAsResourceUrl(Camomile.getMediumURL($scope.browse.medium, $scope.mediaExt));
        }
        console.log($scope.browse.mediumSrc);
      }
    };

    $scope.$watch('browse.layer', function () {
      if ($scope.browse.layer) {
        $scope.infos.layer = $scope.browse.layer;
      }
    })
  }]);
