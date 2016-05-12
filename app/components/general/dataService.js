angular.module('camomileApp.services.data', [])
    .factory('cappdata', function ($timeout, $sce, Camomile) {
        var facto = {};

        facto.corpora = [];
        facto.layers = [];
        facto.media = [];
        facto.annotations = [];
        facto.metadata = [];

        facto.observers = [];
        facto._update = {
            corpora: function () {
                var cb = function (err, data) {
                    if (err) {
                        console.warn('Error in the retrieval of corpora');
                    } else {
                        facto.corpora = data;
                        console.log(facto);
                    }
                    facto.notifyObservers();
                };
                Camomile.getCorpora(cb);
            },
            media: function (corpus_id) {
                var cb = function (err, data) {
                    if (err) {
                        console.warn('Error in the retrieval of media');
                    } else {
                        facto.media = data;
                    }
                    facto.notifyObservers();
                };
                Camomile.getMedia(cb, {
                    'filter': {
                        'id_corpus': corpus_id
                    }
                });
            },
            layers: function (corpus_id) {
                var cb = function (err, data) {
                    if (err) {
                        console.warn('Error in the retrieval of layers');
                    } else {
                        facto.layers = data;
                    }
                    facto.notifyObservers();
                };
                Camomile.getLayers(corpus_id, cb);
            },
            annotations: function (medium_id, layer_id) {
                var cb = function (err, data) {
                    if (err) {
                        console.warn('Error in the retrieval of annotations');
                    } else {
                        facto.annotations = data;
                    }
                    facto.notifyObservers();
                };
                Camomile.getAnnotations(medium_id, layer_id, cb);
            },
            metadata: function () {
                var cb = function (err, data) {
                    if (err) {
                        console.warn('Error in the retrieval of metadata');
                    } else {
                        facto.metadata = data;
                    }
                    facto.notifyObservers();
                };
                Camomile.getMetadata(cb);
            }
        };

        facto.update = function (wtu, ...args) {
            facto._update[wtu](...args);
        };

        facto.getMediumInfos = function (medium_id) {
            var cb = function (err, data) {
                if (err) {
                    console.warn("qzddqz");
                } else {
                    var legit = data;
                    legit.description.extension = legit.description.type;
                    if ( legit.description.extension === 'jpg'
                        || legit.description.extension === 'png') {
                        legit.urlSecure = $sce.trustAsResourceUrl(Camomile.getMediumURL(legit._id, legit.description.extension));
                        legit.description.type = 'image';
                    } else if (legit.description.extension === 'mp4'
                        || legit.description.extension === 'webm') {
                        legit.urlSecure = [{
                            src: $sce.trustAsResourceUrl(Camomile.getMediumURL(legit._id, legit.description.extension)),
                            type: "video/" + legit.description.extension
                        }, {
                            src: $sce.trustAsResourceUrl(Camomile.getMediumURL(legit._id, 'ogg')),
                            type: "video/ogg"
                        }];
                        legit.description.type = 'video';
                    }
                    facto.mediumInfos = legit;
                    console.log(facto.mediumInfos);
                    facto.notifyObservers();
                }
            };
            Camomile.getMedium(medium_id, cb);
        };

        facto.registerObserver = function (callback) {
            facto.observers.push(callback);
        };

        facto.notifyObservers = function () {
            console.log('Change occured');
            angular.forEach(facto.observers, function (cb) {
                cb();
            });
        };

        return facto;
    });
