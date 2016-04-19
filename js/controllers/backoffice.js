angular.module("camomileApp.controllers.backoffice", [])
.controller('BackofficeCtrl', ['$scope', '$log', 'Camomile', function($scope, $log, Camomile) {
  $scope.userCreation = {
    name: '',
    password: '',
    description: [],
    role: 'admin'
  };
  $scope.corpusCreation = {
    name: '',
    description: []
  };
  $scope.groupCreation = {
    name: '',
    description: []
  };
  $scope.mediumCreation = {
    name: '',
    description: []
  };
  $scope.layerCreation = {
    name: '',
    description: []
  };

  // Array of users
  $scope.usersExisting = undefined;
  // Array of group
  $scope.groupsExisting = undefined;
  // Array of corpus
  $scope.corporaExisting = undefined;
  // Array of medium
  $scope.mediaExisting = undefined;
  // Array of layer
  $scope.layerExisting = undefined;

  // Runs at init of module
  $scope.init = function() {
    $scope.getAllUsers();
    $scope.getAllGroups();
    $scope.getAllCorpora();
    $scope.getAllMedia();
  }

  // Read
  $scope.getAllUsers = function() {
    Camomile.getUsers(function(err, data) {
      if (err) {
        $scope.usersExisting = [];
      } else {
        $scope.usersExisting = window.JSON.stringify(data);
      }
    });
  }

  $scope.getAllGroups = function() {
    Camomile.getGroups(function(err, data) {
      if (err) {
        $scope.groupsExisting = [];
      } else {
        $scope.groupsExisting = window.JSON.stringify(data);
      }
    });
  }

  $scope.getAllCorpora = function() {
    Camomile.getCorpora(function(err, data) {
      if (err) {
        $scope.corporaExisting = [];
      } else {
        $scope.corporaExisting = window.JSON.stringify(data);
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

  // Create
  $scope.createNewUser = function() {
    var callback = function(err, data) {
      if (err) {
        window.alert("User creation failed.");
      } else {
        $scope.getAllUsers();
      }
    }
    Camomile.createUser($scope.userCreation.name, $scope.userCreation.password, undefined, $scope.userCreation.role, callback);
  }

  $scope.createNewGroup = function() {
    var callback = function(err, data) {
      if (err) {
        window.alert("Group creation failed.");
      } else {
        $scope.getAllGroups();
      }
    }
    Camomile.createGroup($scope.groupCreation.name, callback);
  }

  $scope.createNewCorpus = function() {
    var callback = function(err, data) {
      if (err) {
        window.alert("Corpus creation failed.");
      } else {
        $scope.getAllCorpora();
      }
    }
    Camomile.createCorpus($scope.corpusCreation.name, callback);
  }

  $scope.createNewMedium = function() {
    var callback = function(err, data) {
      if (err) {
        window.alert("Medium creation failed.");
      } else {
        $scope.getAllMedia();
      }
    }
    Camomile.createMedium($scope.mediumCreation.name, callback);
  }

  // Delete
  /* $scope.deleteUser = function(id) {
    // ****
  } */


  $scope.init();
}]);
