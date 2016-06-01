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
        facto._get = {
            corpora: function (callback) {
                var cb = function (err, data) {
                    if (err) {
                        console.warn('Error in the retrieval of corpora');
                    } else {
                        if (callback && typeof callback == "function") {
                            callback(data);
                        }

                        facto.corpora = data;
                        facto.notifyObservers({type: 'get', model: 'corpora'});
                    }
                };
                Camomile.getCorpora(cb);
            },
            media: function (corpus_id, filter, callback) {
                var cb = function (err, data) {
                    if (err) {
                        console.warn('Error in the retrieval of media');
                    } else {
                        if (callback && typeof callback == "function") {
                            callback(data);
                        }

                        facto.media = data;
                        facto.notifyObservers({type: 'get', model: 'media'});
                    }

                    if (filter) {
                        facto.filterMedium(filter);
                    }
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
            layers: function (corpus_id, callback) {
                var cb = function (err, data) {
                    if (err) {
                        console.warn('Error in the retrieval of layers');
                    } else {
                        if (callback && typeof callback == "function") {
                            callback(data);
                        }

                        facto.layers = data;
                        facto.notifyObservers({type: 'get', model: 'layers'});
                    }
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
            annotations: function (layer_id, medium_id, callback) {
                var cb = function (err, data) {
                    if (err) {
                        console.warn('Error in the retrieval of annotations');
                    } else {
                        if (callback && typeof callback == "function") {
                            console.log('Got ' + data.length + ' events!');
                            callback(data);
                        }

                        facto.annotations = data;
                        facto.notifyObservers({type: 'get', model: 'annotations'});
                    }
                };
                Camomile.getAnnotations(cb, {
                    'filter': {
                        id_layer: layer_id,
                        id_medium: medium_id
                    }
                });
            },
            metadata: function (corpus_id, metadata, callback) {
                for (let m of metadata) {
                    var cb = function (err, data) {
                        if (err) {
                            console.warn('Error in the retrieval of metadata');
                        } else {
                            if (callback && typeof callback == "function") {
                                callback(data);
                            }

                            facto.metadata[m] = data;
                            facto.notifyObservers({type: 'get', model: 'metadata'});
                        }
                    };
                    Camomile.getCorpusMetadata(corpus_id, m, cb);
                }
            },
            medium: function (medium_id, callback) {
                var cb = function (err, data) {
                    if (err) {
                        console.warn("Error: can't retrieve medium informations.");
                    } else {
                        if (callback && typeof callback == "function") {
                            callback(data);
                        }

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

                        facto.notifyObservers({type: 'get', model: 'medium'});
                    }
                };

                Camomile.getMedium(medium_id, cb);
            },
            users: function (callback) {
                Camomile.getUsers(function(err, data) {
                    if (err) {
                        facto.users = [];
                    } else {
                        if (callback && typeof callback == "function") {
                            callback(data);
                        }

                        facto.users = data;
                        facto.notifyObservers({type: 'get', model: 'users'});
                    }
                });
            },
            groups: function (callback) {
                Camomile.getGroups(function(err, data) {
                    if (err) {
                        facto.groups = [];
                    } else {
                        if (callback && typeof callback == "function") {
                            callback(data);
                        }

                        facto.groups = data;
                        facto.notifyObservers({type: 'get', model: 'groups'});
                    }
                });
            }
        };

        facto._delete = {
            corpus: function (id, callback) {
                var cb = function (err, data) {
                    if (err) {}
                    else {
                        if (callback && typeof callback == "function") {
                            callback(data);
                        }

                        facto.notifyObservers({type: 'delete', model: 'corpus'});
                    }
                };
                Camomile.deleteCorpus(id, cb);
            },
            medium: function (id, callback) {
                var cb = function (err, data) {
                    if (err) {}
                    else {
                        if (callback && typeof callback == "function") {
                            callback(data);
                        }

                        facto.notifyObservers({type: 'delete', model: 'medium'});
                    }
                };
                Camomile.deleteMedium(id, cb);
            },
            layer: function (id, callback) {
                var cb = function (err, data) {
                    if (err) {}
                    else {
                        if (callback && typeof callback == "function") {
                            callback(data);
                        }

                        facto.notifyObservers({type: 'delete', model: 'layer'});
                    }
                };
                Camomile.deleteLayer(id, cb);
            },
            user: function (id, callback) {
                var cb = function (err, data) {
                    if (err) {}
                    else {
                        if (callback && typeof callback == "function") {
                            callback(data);
                        }

                        facto.notifyObservers({type: 'delete', model: 'user'});
                    }
                };
                Camomile.deleteUser(id, cb);
            },
            group: function (id, callback) {
                var cb = function (err, data) {
                    if (err) {}
                    else {
                        if (callback && typeof callback == "function") {
                            callback(data);
                        }

                        facto.notifyObservers({type: 'delete', model: 'group'});
                    }
                };
                Camomile.deleteGroup(id, cb);
            },
            annotation: function (id, callback) {
                console.info('Deleting ' + id);
                Camomile.deleteAnnotation(id, function (err, data) {
                    if (err) {
                        console.warn('Deletion of the annotation failed.');
                    } else {
                        if (callback && typeof callback == "function") {
                            callback(data);
                        }

                        facto.notifyObservers({type: 'delete', model: 'annotation'});
                    }
                });
            }
        };

        facto._create = {
            user: function (name, password, description, role, callback) {
                var cb = function (err, data) {
                    if (err) {
                        console.warn('Creation of user failed.');
                    } else {
                        if (callback && typeof callback == "function") {
                            callback(data);
                        }

                        facto.notifyObservers({type: 'create', model: 'user'});
                    }
                };

                Camomile.createUser(name, password, description, role, cb);
            },
            group: function (name, description, callback) {
                var cb = function (err, data) {
                    if (err) {
                        console.warn('Creation of group failed.');
                    } else {
                        if (callback && typeof callback == "function") {
                            callback(data);
                        }

                        facto.notifyObservers({type: 'create', model: 'group'});
                    }
                };

                Camomile.createGroup(name, description, cb);
            },
            corpus: function (name, description, callback) {
                var cb = function (err, data) {
                    if (err) {
                        console.warn('Creation of corpus failed.');
                    } else {
                        if (callback && typeof callback == "function") {
                            callback(data);
                        }

                        facto.notifyObservers({type: 'create', model: 'corpus'});
                    }
                };

                Camomile.createCorpus(name, description, cb);
            },
            medium: function (corpus_id, name, url, description, callback) {
                var cb = function (err, data) {
                    if (err) {
                        console.warn('Creation of medium failed.');
                    } else {
                        if (callback && typeof callback == "function") {
                            callback(data);
                        }

                        facto.notifyObservers({type: 'create', model: 'medium'});
                    }
                };

                Camomile.createMedium(corpus_id, name, url, description, cb);
            },
            layer: function (corpus_id, name, description, fragment_type, data_type, callback) {
                var cb = function (err, data) {
                    if (err) {
                        console.warn('Creation of layer failed.');
                    } else {
                        if (callback && typeof callback == "function") {
                            callback(data);
                        }

                        facto.notifyObservers({type: 'create', model: 'layer'});
                    }
                };

                Camomile.createLayer(corpus_id, name, description, fragment_type, data_type, cb);
            },
            annotation: function (layer_id, medium_id, fragment, data, callback) {
                var cb = function (err, data) {
                    if (err) {
                        console.warn('Creation of annotation failed.');
                    } else {
                        if (callback && typeof callback == "function") {
                            callback(data);
                        }

                        facto.notifyObservers({type: 'create', model: 'annotation'});
                    }
                };
                Camomile.createAnnotation(layer_id, medium_id, fragment, data, cb);
            },
            annotations: function (layer_id, annotations, callback) {
                var cb = function (err, data) {
                    if (err) {
                        console.warn('Creation of annotations failed.');
                    } else {
                        facto.notifyObservers({type: 'create', model: 'annotations'});
                    }
                };

                Camomile.createAnnotations(layer_id, annotations, cb);
            }
        };

        facto._update = {
            annotation: function (annotation_id, fragment, data, callback) {
                var cb = function (err, data) {
                    if (err) {
                        console.warn('Error in updating annotation');
                    } else {
                        facto.notifyObservers({type: 'update', model: 'annotation'});
                    }
                };
                Camomile.updateAnnotation(annotation_id, {fragment: fragment, data: data}, cb);
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

        facto.get = function (model, ...args) {
            facto._get[model](...args);
        };

        facto.delete = function (model, ...args) {
            facto._delete[model](...args);
        };

        facto.create = function (model, ...args) {
            facto._create[model](...args);
        };

        facto.update = function (model, ...args) {
            facto._update[model](...args);
        };

        facto.resetMedium = function () {
            facto.mediaSelected = [];
        };

        facto.registerObserver = function (callback) {
            facto.observers.push(callback);
        };

        facto.notifyObservers = function (informations) { // Call this function when data changed
            console.log('Change occured; notifying ' + facto.observers.length + " observers. (" + informations.type + ": " + informations.model + ")");

            angular.forEach(facto.observers, function (cb) {
                cb();
            });
        };

        return facto;
    });
