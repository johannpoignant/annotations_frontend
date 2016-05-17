angular.module('camomileApp.services.data', [])
    .factory('cappdata', function ($timeout, $sce, Camomile) {
        var facto = {};

        // Variables contenant les informations disponibles
        facto.corpora = [];
        facto.layers = [];
        facto.media = [];
        facto.annotations = [];
        facto.metadata = [];

        // Variables contenant les informations demandées & sélectionnées
        facto.corpusSelected = undefined;
        facto.layerSelected = undefined;
        facto.mediaSelected = [];
        facto.annotationsSelected = [];
        facto.metadataSelected = [];

        facto.observers = []; // Observers

        // Updates fonctions
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
            media: function (corpus_id, filter) {
                var cb = function (err, data) {
                    if (err) {
                        console.warn('Error in the retrieval of media');
                    } else {
                        facto.media = data;
                    }

                    if (filter) {
                        facto.filterMedium(filter);
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
            },
            medium: function (medium_id) {
                var cb = function (err, data) {
                    if (err) {
                        console.warn("Error: can't retrieve medium informations.");
                    } else {
                        var legit = data;

                        if (legit.description.type === "video") {
                            legit.urlSecure = [{
                                src: $sce.trustAsResourceUrl(Camomile.getMediumURL(legit._id, legit.description.extension)),
                                type: "video/" + legit.description.extension
                            }, {
                                src: $sce.trustAsResourceUrl(Camomile.getMediumURL(legit._id, 'ogg')),
                                type: "video/ogg"
                            }];
                        } else if (legit.description.type === "image") {
                            legit.urlSecure = $sce.trustAsResourceUrl(Camomile.getMediumURL(legit._id, legit.description.extension));
                        }

                        facto.mediaSelected.push(legit);

                        facto.notifyObservers();
                    }
                };

                Camomile.getMedium(medium_id, cb);
            }
        };

        facto.filterMedium = function (ext) {
            var nMedia = [];
            var filterByType = false;
            if (ext === "image" || ext === "video") {filterByType = true;}
            for (m of facto.media) {
                var mExt;
                if (filterByType) {mExt = m.description.type;}
                else {mExt = m.description.extension;}

                if (ext == mExt) {
                    nMedia.push(m);
                }
            }
            facto.media = nMedia;
        };

        facto.update = function (wtu, ...args) {
            facto._update[wtu](...args);
        };

        facto.resetMedium = function () {
            facto.mediaSelected = [];
        };

        facto.registerObserver = function (callback) {
            facto.observers.push(callback);
        };

        facto.notifyObservers = function () { // Call this function when data changed
            console.log('Change occured; notifying ' + facto.observers.length + " observers.");
            angular.forEach(facto.observers, function (cb) {
                cb();
            });
        };

        return facto;
    });
