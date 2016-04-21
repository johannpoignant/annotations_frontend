angular.module("camomileApp.controllers.backoffice", [])
.controller('BackofficeCtrl', ['$scope', '$log', 'Camomile', '$uibModal', function($scope, $log, Camomile, $uibModal) {
  // Creates modal allowing to edit the description of the object selected
  $scope.setDescription = function(descObject) {
    var modalInstance = $uibModal.open({
      animation: true,
      templateUrl: 'views/customizeDescription.html',
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
      $log.info('Modal dismissed at: ' + new Date());
    });
  }

  // Object containing all the informations on the view (use these)
  $scope.creation = {
    user: {
      name: '',
      password: '',
      description: [],
      role: 'admin'
    },
    group: {
      name: '',
      description: []
    },
    corpus: {
      name: '',
      description: []
    },
    medium: {
      name: '',
      description: []
    },
    layer: {
      name: '',
      description: []
    },
    userToGroup: {
      userId: '',
      groupId: ''
    }
  }

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

  // Runs at init of module
  $scope.init = function() {
    $scope.getAllUsers();
    $scope.getAllGroups();
    $scope.getAllCorpora();
    $scope.getAllMedia();
    $scope.getAllLayers();
  }

  // Read (getters)
  $scope.getAllUsers = function() {
    Camomile.getUsers(function(err, data) {
      if (err) {
        $scope.usersExisting = [];
      } else {
        $scope.usersExisting = data;
      }
    });
  }

  $scope.getAllGroups = function() {
    Camomile.getGroups(function(err, data) {
      if (err) {
        $scope.groupsExisting = [];
      } else {
        $scope.groupsExisting = data;
      }
    });
  }

  $scope.getAllCorpora = function() {
    Camomile.getCorpora(function(err, data) {
      if (err) {
        $scope.corporaExisting = [];
      } else {
        $scope.corporaExisting = data;
      }
    });
  }

  $scope.getAllMedia = function() {
    Camomile.getMedia(function(err, data) {
      if (err) {
        $scope.mediaExisting = [];
      } else {
        $scope.mediaExisting = window.JSON.stringify(data);
      }
    });
  }

  $scope.getAllLayers = function() {
    Camomile.getLayers(function(err, data) {
      if (err) {
        $scope.layersExisting = [];
      } else {
        $scope.layersExisting = data;
      }
    });
  }

  // Create
  $scope.createNewUser = function() {
    var callback = function(err, data) {
      if (err) {
        window.alert("User creation failed.");
      } else {
        $scope.getAllUsers();
      }
    }
    Camomile.createUser($scope.creation.user.name, $scope.creation.user.password, $scope.arrayFromDescObject($scope.creation.user.description), $scope.creation.user.role, callback);
  }

  $scope.createNewGroup = function() {
    var callback = function(err, data) {
      if (err) {
        window.alert("Group creation failed.");
      } else {
        $scope.getAllGroups();
      }
    }
    Camomile.createGroup($scope.creation.group.name, $scope.arrayFromDescObject($scope.creation.group.description), callback);
  }

  $scope.createNewCorpus = function() {
    var callback = function(err, data) {
      if (err) {
        window.alert("Corpus creation failed.");
      } else {
        $scope.getAllCorpora();
      }
    }
    Camomile.createCorpus($scope.creation.corpus.name, $scope.arrayFromDescObject($scope.creation.corpus.description), callback);
  }

  $scope.createNewMedium = function() {
    var callback = function(err, data) {
      if (err) {
        window.alert("Medium creation failed.");
      } else {
        $scope.getAllMedia();
      }
    }
    Camomile.createMedium($scope.creation.medium.name, $scope.arrayFromDescObject($scope.creation.medium.description), callback);
  }

  $scope.createNewLayer = function() {
    var callback = function(err, data) {
      if (err) {
        window.alert("Layer creation failed.");
      } else {
        $scope.getAllLayers();
      }
    }
    Camomile.createLayer($scope.creation.layer.name, $scope.arrayFromDescObject($scope.creation.layer.description), callback);
  }

  $scope.addUserToGroup = function() {
    var callback = function(err, data) {
      if (err) {
        window.alert("User not added to group.");
      } else {
        $scope.getAllUsers();
      }
    }
    Camomile.addUserToGroup($scope.creation.userToGroup.userId, $scope.creation.userToGroup.groupId, callback);
  }

  // Transforms an object {key: "...", value: "..."} into ["...", "..."]
  // Needed to be able to send the description to the server
  $scope.arrayFromDescObject = function(object) {
    var narray = [];
    for (v of object)
      narray.push([v.key, v.value])
    return narray;
  }

  // Delete
  $scope.deleteUser = function(id) {
    // ****
    var callback = function(err, data) {
      if (err) {
        window.alert('Deletion of user failed.');
      } else {
        $scope.getAllUsers();
      }
    }
    Camomile.deleteUser(id, callback);
  }


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
