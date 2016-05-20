angular.module('camomileApp.services.data', [])
    .factory('cappdata', function ($timeout, $sce, Camomile) {
        var facto = {};

        facto.clean = function () {
            // Variables contenant les informations disponibles
            facto.corpora = [];
            facto.layers = [];
            facto.media = [];
            facto.annotations = [];
            facto.metadata = {};
            facto.users = [];
            facto.groups = [];

            // Variables contenant les informations demandées & sélectionnées
            facto.corpusSelected = undefined;
            facto.layerSelected = undefined;
            facto.mediaSelected = [];
            facto.annotationsSelected = [];
            facto.metadataSelected = [];
            facto.userSelected = undefined;

            facto.observers = []; // Observers
        };

        facto.clean();

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

                if (corpus_id === undefined) {
                    filt = {};
                } else {
                    filt = {
                        'filter': {
                            'id_corpus': corpus_id
                        }
                    };
                }

                Camomile.getMedia(cb, filt);
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

                let filter = {};

                if (corpus_id !== undefined) {
                    filter = {
                        'filter': {
                            'corpus_id': corpus_id
                        }
                    };
                }

                Camomile.getLayers(cb, filter);
            },
            annotations: function (medium_id, layer_id) {
                var cb = function (err, data) {
                    if (err) {
                        console.warn('Error in the retrieval of annotations');
                    } else {
                        facto.annotations = data;
                        /*for (obj of data) { // We push every fragment to recreate the array
                            ans.push({fragment: obj.fragment, id: obj._id});
                        }*/
                    }
                    facto.notifyObservers();
                };
                Camomile.getAnnotations(cb, {
                    'filter': {
                        id_layer: layer_id,
                        id_medium: medium_id
                    }
                });
            },
            metadata: function (corpus_id, metadata) {
                for (let m of metadata) {
                    var cb = function (err, data) {
                        if (err) {
                            console.warn('Error in the retrieval of metadata');
                        } else {
                            facto.metadata[m] = data;
                        }
                        facto.notifyObservers();
                    };
                    Camomile.getCorpusMetadata(corpus_id, m, cb);
                }
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
            },
            users: function () {
                Camomile.getUsers(function(err, data) {
                    if (err) {
                        facto.users = [];
                    } else {
                        facto.users = data;
                        facto.notifyObservers();
                    }
                });
            },
            groups: function () {
                Camomile.getGroups(function(err, data) {
                    if (err) {
                        facto.groups = [];
                    } else {
                        facto.groups = data;
                        facto.notifyObservers();
                    }
                });
            }
        };

        facto._delete = {
            corpus: function () {
                var cb = function (err, data) {
                    if (err) {}
                    else {
                        facto.notifyObservers();
                    }
                };
                Camomile.deleteCorpus(id, cb);
            },
            medium: function () {
                var cb = function (err, data) {
                    if (err) {}
                    else {
                        facto.notifyObservers();
                    }
                };
                Camomile.deleteMedium(id, cb);
            },
            layer: function () {
                var cb = function (err, data) {
                    if (err) {}
                    else {
                        facto.notifyObservers();
                    }
                };
                Camomile.deleteLayer(id, cb);
            },
            user: function () {
                var cb = function (err, data) {
                    if (err) {}
                    else {
                        facto.notifyObservers();
                    }
                };
                Camomile.deleteUser(id, cb);
            },
            group: function () {
                var cb = function (err, data) {
                    if (err) {}
                    else {
                        facto.notifyObservers();
                    }
                };
                Camomile.deleteGroup(id, cb);
            },
            annotation: function (annotation_id) {
                Camomile.deleteAnnotation(annotation_id, function (err, data) {
                    if (err) {
                        console.warn('Deletion of the annotation failed.');
                    } else {
                        facto.notifyObservers();
                    }
                });
            }
        };

        facto._create = {
            user: function (name, password, description, role) {
                var cb = function (err, data) {
                    if (err) {
                        console.warn('Creation of user failed.');
                    } else {
                        facto.notifyObservers();
                    }
                };

                Camomile.createUser(name, password, description, role, cb);
            },
            group: function (name, description) {
                var cb = function (err, data) {
                    if (err) {
                        console.warn('Creation of group failed.');
                    } else {
                        facto.notifyObservers();
                    }
                };

                Camomile.createGroup(name, description, cb);
            },
            corpus: function (name, description) {
                var cb = function (err, data) {
                    if (err) {
                        console.warn('Creation of corpus failed.');
                    } else {
                        facto.notifyObservers();
                    }
                };

                Camomile.createCorpus(name, description, cb);
            },
            medium: function (corpus_id, name, url, description) {
                var cb = function (err, data) {
                    if (err) {
                        console.warn('Creation of medium failed.');
                    } else {
                        facto.notifyObservers();
                    }
                };

                Camomile.createMedium(corpus_id, name, url, description, cb);
            },
            layer: function (corpus_id, name, description, fragment_type, data_type) {
                var cb = function (err, data) {
                    if (err) {
                        console.warn('Creation of layer failed.');
                    } else {
                        facto.notifyObservers();
                    }
                };

                Camomile.createLayer(corpus_id, name, description, fragment_type, data_type, cb);
            },
            annotations: function (layer_id, annotations) {
                var cb = function (err, data) {
                    if (err) {
                        console.warn('Creation of annotations failed.');
                    } else {
                        facto.notifyObservers();
                    }
                };

                Camomile.createAnnotations(layer_id, annotations, cb);
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

        facto.delete = function (wtu, ...args) {
            facto._delete[wtu](...args);
        };

        facto.create = function (wtu, ...args) {
            facto._create[wtu](...args);
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
