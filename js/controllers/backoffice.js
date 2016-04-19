angular.module("camomileApp.controllers.backoffice", [])
.controller('BackofficeCtrl', ['$scope', '$log', 'Camomile', function($scope, $log, Camomile) {
  $scope.userCreation = {
    name: '',
    password: '',
    role: 'admin'
  };
  $scope.corporaCreation = {
    name: ''
  };
  $scope.groupCreation = {
    name: '',
    password: ''
  };

  $scope.usersExisting = undefined;
  $scope.groupsExisting = undefined;
  $scope.corporaExisting = undefined;

  $scope.init = function() {
    $scope.getAllUsers();
    $scope.getAllGroups();
    $scope.getAllCorpora();
  }

  $scope.getAllUsers = function() {
    Camomile.getUsers(function(err, data) {
      $scope.usersExisting = window.JSON.stringify(data);
    });
  }

  $scope.getAllGroups = function() {
    Camomile.getGroups(function(err, data) {
      $scope.groupsExisting = window.JSON.stringify(data);
    });
  }

  $scope.getAllCorpora = function() {
    Camomile.getCorpora(function(err, data) {
      $scope.corporaExisting = window.JSON.stringify(data);
    });
  }

  $scope.createNewUser = function() {
    Camomile.createUser($scope.userCreation.name, $scope.userCreation.password, undefined, $scope.userCreation.role);
    $log.log("Compte créé.");
  }

  $scope.init();
}]);
