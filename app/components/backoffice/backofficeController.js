angular.module("camomileApp.controllers.backoffice", [])
    .controller('BackofficeCtrl', ['$scope', '$log', 'Camomile', '$uibModal', '$timeout', 'cappdata',
    function($scope, $log, Camomile, $uibModal, $timeout, cappdata) {
        $scope.api = {};

        var refresh = function () {
            cappdata.clean();
            $scope.api.loader.loading(5);
            cappdata.get('corpora');
            cappdata.get('media');
            cappdata.get('layers');
            cappdata.get('users');
            cappdata.get('groups');
            cappdata.registerObserver(updateData);
        };

        var updateData = function () {
            $timeout(function () {
                $scope.cappdata = cappdata;
                $scope.initCreation();
                $scope.api.loader.finished();
            }, 0);
        };

        $scope.$parent.onLogin(refresh);

        $timeout(function () {
            refresh();
        }, 0);

        // Creates modal allowing to edit the description of the object selected
        $scope.setFields = function(fieldObject, field) {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'app/shared/modal/setFields.html',
                controller: 'SetFieldsCtrl',
                size: 'small',
                resolve: {
                    fieldObject: function () {
                        return fieldObject;
                    },
                    field: function () {
                        return field;
                    }
                }
            });

            modalInstance.result.then(function () {
                $log.info('Finished with fields');
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

        // Array of rights
        $scope.rightsExisting = [
            {key: 1, value: 'Read'},
            {key: 2, value: 'Write'},
            {key: 3, value: 'Admin'}
        ];

        // Convert id into objects
        $scope.convertCorpus = function (id) {
            for (c of cappdata.corpora) {
                if (c._id === id)
                    return c
            }
            return id;
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
    }])
    // Controller for the description modal
    .controller('SetFieldsCtrl', function($scope, $uibModalInstance, fieldObject, field) {
        $scope.ve = fieldObject[field]; // Gets the field
        $scope.fieldObject = fieldObject;

        // Adds a new field in ve if needed
        $scope.addField = function() {
            if (!$scope.ve[0] || $scope.ve[$scope.ve.length - 1].key != "")
                $scope.ve.push({key: '', value: ''});
        };

        // Validate the entries
        $scope.ok = function () {
            $scope.fieldObject[field] = $scope.arrayFromDescObject($scope.ve.slice(0, $scope.ve.length - 1));
            $uibModalInstance.close();
        };

        // Cancels everything, data will be lost
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

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
            } else { // {"...": "..."} into {key: "...", value: "..."}
                output = [];
                for (k in object) {
                    let o = object[k];
                    output.push({key: k, value: o});
                }
            }

            return output;
        };

        if (!$scope.ve) {
            $scope.ve = [];
        } else {
            $scope.ve = $scope.arrayFromDescObject($scope.ve, 2);
        }

        $scope.addField(); // Add a field if needed
    });
