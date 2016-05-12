angular.module('camomileApp.controllers.objects', [])
    .controller('ObjectsCtrl', function ($scope, $interval, $sce, $timeout, Camomile) {
        $scope.corpora = [];
        $scope.layers = [];
        $scope.objects = [];
        $scope.endroits = [];

        $scope.corpusSelected = undefined;
        $scope.layerSelected = undefined;
        $scope.objectSelected = undefined;
        $scope.endroitSelected = undefined;

        $scope.getAllCorpora = function() {
            Camomile.getCorpora(function(err, data) {
                if (err) {
                    $scope.corpora = [];
                } else {
                    $scope.$apply(function() {
                        $scope.corpora = data;
                    });
                }
            });
        };

        $scope.getAllLayers = function() {
            Camomile.getLayers(function(err, data) {
                if (err) {
                    $scope.layers = [];
                } else {
                    $scope.$apply(function() {
                        $scope.layers = data;
                    });
                }
            }, {
                filter: {
                    id_corpus: $scope.corpus
                }
            });
        };

        $scope.getAllObjects = function () {
            var callback = function (err, data) {
                if (err) {
                    console.warn('Error');
                } else {
                    console.log(data);
                    $scope.$apply(function () {
                        $scope.objects = data;
                    });
                }
            };
            Camomile.getCorpusMetadata($scope.corpusSelected, "objet", callback);
        };

        $scope.getAllEndroits = function () {
            var callback = function (err, data) {
                if (err) {
                    console.warn('Error');
                } else {
                    console.log(data);
                    $scope.$apply(function () {
                        $scope.endroits = data;
                    });
                }
            };
            Camomile.getCorpusMetadata($scope.corpusSelected, "endroit", callback);
        };

        $scope.getMedium = function (medium_id) {
            return Camomile.getMediumURL($scope.corpusSelected, medium_id);
        };

        $scope.getMediumByName = function (corpus, medium) {
            var callback = function (err, data) {
                if (err) {

                } else {
                    console.log('Medium found!');
                    console.log(data);
                }
            };
            Camomile.getMedia(callback, {
                'filter': {
                    'id_corpus': corpus,
                    'name': medium
                }
            });
        };

        $scope.addObject = function () {
            var a = '{"objet":[{"Salle":"4","Etage":"A","Endroit":5,"Id_texte":"","media":[1361,1362],"sous_partie":"dxc3xa9tail","Id_POI_adulte":"/","id_musee":"","type":"2 sur 2","Id_POI_enfant":"/"},{"Salle":"1","Etage":"A","Endroit":6,"Id_texte":"Triomphe de Bacchus","media":[1284,1285,1286],"sous_partie":"","Id_POI_adulte":"1","id_musee":"","type":"","Id_POI_enfant":"51"}]}';
            var obj = JSON.parse(a);
            var callback = function (err, data) {
                if (err) {
                    console.warn('Error');
                } else {
                    console.log(data);
                }
            };
            Camomile.setCorpusMetadata($scope.corpusSelected, obj, callback);
        };

        $scope.validateMedia = function () {
            $scope.mediumSrc = [];
            var desc = {};

            for (let m of $scope.objectSelected.media) {
                var callback = function (err, data) {
                    if (err) {
                        console.warn('Error in getMedium');
                    } else {
                        desc = data;

                        $scope.mediumSrc.push({
                            infos: {
                                layer: '', // Eventually the layer id
                                medium: m
                            },
                            description: desc.description
                        });
                        // Do the switch: type to extension, type to real type (image or video)
                        if (desc.description.type) {
                            var ext = $scope.mediumSrc[$scope.mediumSrc.length - 1].description.extension = desc.description.type.toLowerCase();
                            if (   ext == "mp4"
                                || ext == "webm" ) {
                                $scope.mediumSrc[$scope.mediumSrc.length - 1].description.type = 'video';
                                $scope.mediumSrc[$scope.mediumSrc.length - 1].srcs = [{
                                    src: $sce.trustAsResourceUrl(Camomile.getMediumURL(m, ext)),
                                    type: "video/" + ext
                                }, {
                                    src: $sce.trustAsResourceUrl(Camomile.getMediumURL(m, 'ogg')),
                                    type: "video/ogg"
                                }];
                            } else if (  ext == "png"
                                || ext == "jpg" ) {
                                $scope.mediumSrc[$scope.mediumSrc.length - 1].description.type = 'image';
                                $scope.mediumSrc[$scope.mediumSrc.length - 1].srcs = $sce.trustAsResourceUrl(Camomile.getMediumURL(m, ext));
                            }
                        }
                    }
                    console.log($scope.mediumSrc);
                    console.log('Media validated');
                };

                Camomile.getMedium(m, callback);
            }
        };

        $scope.init = function () {
            $scope.getAllCorpora();
        };

        $scope.init();

        $scope.$watch('corpusSelected', function () {
            if ($scope.corpusSelected) {
                $scope.getAllLayers();
                $scope.getAllObjects();
            }
        });

        $scope.$watch('objectSelected', function () {
            if ($scope.objectSelected) {
                $scope.validateMedia();
            }
        });
    })
    .filter('currentdate',['$filter',  function($filter) {
        return function() {
            return $filter('date')(new Date(), 'hh:mm:ss MMMM');
        };
    }]);
