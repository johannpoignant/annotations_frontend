angular.module("camomileApp.controllers.backoffice", [])
    .controller('BackofficeCtrl', ['$scope', '$log', 'Camomile', '$uibModal', '$timeout', function($scope, $log, Camomile, $uibModal, $timeout) {
        // Creates modal allowing to edit the description of the object selected
        $scope.setDescription = function(descObject) {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'app/shared/modal/customizeDescription.html',
                controller: 'CustomizeDescriptionCtrl',
                size: 'small',
                resolve: {
                    descObject: function () {
                        return descObject;
                    }
                }
            });

            modalInstance.result.then(function () {
                $log.info('Finished with description');
            }, function () {
                $log.info('Canceled edit');
            });
        };

        $scope.newUser = function () {
            $scope.creation.user = {
                name: '',
                password: '',
                description: [],
                role: 'user'
            };
        };

        $scope.newGroup = function () {
            $scope.creation.group = {
                name: '',
                description: []
            };
        };

        $scope.newCorpus = function () {
            $scope.creation.corpus = {
                name: '',
                description: []
            };
        };

        $scope.newMedium = function () {
            $scope.creation.medium = {
                name: '',
                url: '',
                corpus: '',
                description: []
            };
        };

        $scope.newLayer = function () {
            $scope.creation.layer = {
                name: '',
                corpus: '',
                description: []
            };
        };

        $scope.newUserToGroup = function () {
            $scope.creation.userToGroup = {
                userId: '',
                groupId: ''
            };
        };

        $scope.newRightsToUserOnCorpus = function () {
            $scope.creation.rightsToUserOnCorpus = {
                userId: '',
                corpusId: '',
                rights: ''
            };
        };

        $scope.newRightsToUserOnLayer = function () {
            $scope.creation.rightsToUserOnLayer = {
                userId: '',
                layerId: '',
                rights: ''
            };
        };

        $scope.initCreation = function () {
            $scope.creation = {};
            $scope.newUser();
            $scope.newGroup();
            $scope.newCorpus();
            $scope.newMedium();
            $scope.newLayer();
            $scope.newUserToGroup();
            $scope.newRightsToUserOnCorpus();
            $scope.newRightsToUserOnLayer();
        };

        $scope.initCreation();

        // Array of users
        $scope.usersExisting = undefined;
        // Array of group
        $scope.groupsExisting = undefined;
        // Array of corpus
        $scope.corporaExisting = undefined;
        // Array of medium
        $scope.mediaExisting = undefined;
        // Array of layer
        $scope.layersExisting = undefined;
        // Array of rights
        $scope.rightsExisting = [
            {key: 1, value: 'Read'},
            {key: 2, value: 'Write'},
            {key: 3, value: 'Admin'}
        ];

        // Runs at init of module
        $scope.init = function() {
            $scope.getAllUsers();
            $scope.getAllGroups();
            $scope.getAllCorpora();
            $scope.getAllMedia();
            $scope.getAllLayers();
        };

        // Read (getters)
        $scope.getAllUsers = function() {
            Camomile.getUsers(function(err, data) {
                if (err) {
                    $scope.usersExisting = [];
                } else {
                    $timeout(function () {
                        $scope.usersExisting = data;
                    });
                }
            });
        };

        $scope.getAllGroups = function() {
            Camomile.getGroups(function(err, data) {
                if (err) {
                    $scope.groupsExisting = [];
                } else {
                    $timeout(function () {
                        $scope.groupsExisting = data;
                    });
                }
            });
        };

        $scope.getAllCorpora = function() {
            Camomile.getCorpora(function(err, data) {
                if (err) {
                    $scope.corporaExisting = [];
                } else {
                    $timeout(function () {
                        $scope.corporaExisting = data;
                    });
                }
            });
        };

        $scope.getAllMedia = function() {
            Camomile.getMedia(function(err, data) {
                if (err) {
                    $scope.mediaExisting = [];
                } else {
                    $timeout(function () {
                        $scope.mediaExisting = data;
                    });
                }
            });
        };

        $scope.getAllLayers = function() {
            Camomile.getLayers(function(err, data) {
                if (err) {
                    $scope.layersExisting = [];
                } else {
                    $timeout(function () {
                        $scope.layersExisting = data;
                    });
                }
            });
        };

        // Convert id into objects
        $scope.convertCorpus = function (id) {
            for (c of $scope.corporaExisting) {
                if (c._id === id)
                    return c
            }
            return id;
        };

        // Create
        $scope.createNewUser = function() {
            var da = $scope.creation.user;
            var callback = function(err, data) {
                if (err) {
                    window.alert("User creation failed.");
                } else {
                    $scope.getAllUsers();
                    $scope.newUser();
                }
            };
            Camomile.createUser(da.name, da.password, $scope.arrayFromDescObject(da.description), da.role, callback);
        };

        $scope.createNewGroup = function() {
            var da = $scope.creation.group;
            var callback = function(err, data) {
                if (err) {
                    window.alert("Group creation failed.");
                } else {
                    $scope.getAllGroups();
                    $scope.newGroup();
                }
            };
            Camomile.createGroup(da.name, $scope.arrayFromDescObject(da.description), callback);
        };

        $scope.createNewCorpus = function() {
            var da = $scope.creation.corpus;
            var callback = function(err, data) {
                if (err) {
                    window.alert("Corpus creation failed.");
                } else {
                    $scope.getAllCorpora();
                    $scope.newCorpus();
                }
            };
            Camomile.createCorpus(da.name, $scope.arrayFromDescObject(da.description), callback);
        };

        $scope.createNewMedium = function() {
            var da = $scope.creation.medium;
            var callback = function(err, data) {
                if (err) {
                    window.alert("Medium creation failed.");
                } else {
                    $scope.getAllMedia();
                    $scope.newMedium();
                }
            };
            Camomile.createMedium(da.corpus, da.name, da.url, $scope.arrayFromDescObject(da.description), callback);
        };

        $scope.createNewLayer = function() {
            var da = $scope.creation.layer;
            var callback = function(err, data) {
                if (err) {
                    window.alert("Layer creation failed.");
                } else {
                    $scope.getAllLayers();
                    $scope.newLayer();
                }
            };
            Camomile.createLayer(da.corpus, da.name, $scope.arrayFromDescObject(da.description), {}, {}, callback);
        };

        $scope.addUserToGroup = function() {
            var da = $scope.creation.userToGroup;
            var callback = function(err, data) {
                if (err) {
                    window.alert("User not added to group.");
                } else {
                    $scope.getAllGroups();
                    $scope.newUserToGroup();
                }
            };
            Camomile.addUserToGroup(da.userId, da.groupId, callback);
        };

        $scope.addRightsToUserOnCorpus = function() {
            var da = $scope.creation.rightsToUserOnCorpus;
            var callback = function(err, data) {
                if (err) {
                    window.alert("Rights not added to user on corpus.");
                } else {
                    // $scope.getAllGroups();
                    $scope.newRightsToUserOnCorpus();
                }
            };
            Camomile.setCorpusPermissionsForUser(da.corpusId, da.userId, da.rights, callback);
        };

        $scope.addRightsToUserOnLayer = function() {
            var da = $scope.creation.rightsToUserOnLayer;
            var callback = function(err, data) {
                if (err) {
                    window.alert("Rights not added to user on layer.");
                } else {
                    // $scope.getAllGroups();
                    $scope.newRightsToUserOnLayer();
                }
            };
            Camomile.setLayerPermissionsForUser(da.layerId, da.userId, da.rights, callback);
        };

        // Transforms an object
        // Needed to be able to send the description to the server
        $scope.arrayFromDescObject = function(object, mode) {
            mode = mode ? mode : 1; // 0: Array, 1: Object
            let output = undefined;

            if (mode === 0) { // {key: "...", value: "..."} into ["...", "..."]
                output = [];
                for (v of object)
                    output.push([v.key, v.value])
            } else if (mode === 1) { // {key: "...", value: "..."} into {"...": "..."}
                output = {};
                for (v of object)
                    if (!output.hasOwnProperty(v.key))
                        output[v.key] = v.value;
            }

            return output;
        };

        // Delete
        $scope.deleteUser = function(id) {
            var callback = function(err, data) {
                if (err) {
                    window.alert('Deletion of user failed.');
                } else {
                    $scope.getAllUsers();
                }
            };
            Camomile.deleteUser(id, callback);
        };

        $scope.deleteGroup = function(id) {
            var callback = function(err, data) {
                if (err) {
                    window.alert('Deletion of group failed.');
                } else {
                    $scope.getAllGroups();
                }
            };
            Camomile.deleteGroup(id, callback);
        };

        $scope.deleteCorpus = function(id) {
            var callback = function(err, data) {
                if (err) {
                    window.alert('Deletion of corpus failed.');
                } else {
                    $scope.getAllCorpora();
                }
            };
            Camomile.deleteCorpus(id, callback);
        };

        $scope.deleteMedium = function(id) {
            var callback = function(err, data) {
                if (err) {
                    window.alert('Deletion of medium failed.');
                } else {
                    $scope.getAllMedia();
                }
            };
            Camomile.deleteMedium(id, callback);
        };

        $scope.deleteLayer = function(id) {
            var callback = function(err, data) {
                if (err) {
                    window.alert('Deletion of layer failed.');
                } else {
                    $scope.getAllLayers();
                }
            };
            Camomile.deleteLayer(id, callback);
        };

        $scope.init();
    }])
    // Controller for the description modal
    .controller('CustomizeDescriptionCtrl', function($scope, $uibModalInstance, $log, descObject) {
        $scope.ve = descObject.description; // Gets the description
        $scope.descObject = descObject;

        // Adds a new field in ve if needed
        $scope.addField = function() {
            if (!$scope.ve[0] || $scope.ve[$scope.ve.length - 1].key != "")
                $scope.ve.push({key: '', value: ''});
        };

        // Validate the entries
        $scope.ok = function () {
            $scope.descObject.description = $scope.ve.slice(0, $scope.ve.length - 1);
            $uibModalInstance.close();
        };

        // Cancels everything, data will be lost
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

        $scope.addField(); // Add a field if needed
    });
