angular.module('camomileApp.controllers.browse', [
    "ngSanitize",
    "com.2fdevs.videogular",
    "com.2fdevs.videogular.plugins.controls"
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

    $scope.infos = {};

    // update list of corpora
    var getCorpora = function () {
      Camomile.getCorpora(function (err, data) {
        var corpora;
        if (err) {
          corpora = [];
        } else {
          corpora = data;
        }

        $scope.$apply(function () {
          $scope.browse.corpora = corpora;
          $scope.loaded = true;
          console.log('Loaded finished');
        });
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
      $scope.reloadMedium();
    });

    $scope.reloadMedium = function () {
      // Try to get the url
      if ($scope.browse.medium) {
        $scope.infos.medium = $scope.browse.medium;
        var callback = function (err, data) {
          if (err) {
            console.warn('Error in getMedium');
          } else {
            desc = data;
            console.log(desc);

            // Do the switch: type to extension, type to real type (image or video)
            if (desc.description.type) {
              var ext = desc.description.type.toLowerCase();
              if (   ext == "mp4"
                  || ext == "webm" ) {
                $scope.browse.mediumType = 'video';
                $scope.browse.mediumSrc = [{
                  src: $sce.trustAsResourceUrl(Camomile.getMediumURL($scope.browse.medium, ext)),
                  type: "video/" + ext
                }, {
                  src: $sce.trustAsResourceUrl(Camomile.getMediumURL($scope.browse.medium, 'ogg')),
                  type: "video/ogg"
                }];
              } else if (  ext == "png"
                        || ext == "jpg" ) {
                $scope.browse.mediumType = 'image';
                $scope.browse.mediumSrc = $sce.trustAsResourceUrl(Camomile.getMediumURL($scope.browse.medium, ext));
              }
              console.log($scope.browse.mediumSrc);
            }
          }
        };

        Camomile.getMedium($scope.browse.medium, callback);
      }
    };

    $scope.$watch('browse.layer', function () {
      if ($scope.browse.layer) {
        $scope.infos.layer = $scope.browse.layer;
      }
    })
  }])
.filter('filterByExt', function() {
  return function(input, ext, filtering) {
    if (!ext || !filtering) { // If extension is null or undefined, we return the input
      return input;
    }

    ext = ext.toLowerCase(); // Else, we transform MP4 in mp4 (example)
    var patt = new RegExp('.+\.' + ext); // We build the regexp
    var out = []; // Array that will contain the output
    for (var i = 0; i < input.length; i++) { // For each element in the input
        if (patt.test(input[i].name.toLowerCase())) { // We test it against the pattern
          out.push(input[i]); // If it matches, we add it to the output array
        }
    }
    return out; // And we return this array
  };
});
