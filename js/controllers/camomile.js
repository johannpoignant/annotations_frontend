angular.module('camomile.controllers', []).controller('CamomileCtrl', ['$scope', 'Camomile', function ($scope, Camomile) {

  $scope.user = undefined;

  var onLoginCallback;
  // set callback called after login
  $scope.onLogin = function (callback) {
    onLoginCallback = callback;
  };

  var onLogoutCallback;
  // set callback called after logout
  $scope.onLogout = function (callback) {
    onLogoutCallback = callback;
  };

  // set callback called after login and/or logout
  $scope.onLogInOrOut = function (callback) {
    onLoginCallback = callback;
    onLogoutCallback = callback;
  };

  // authenticate user by making a call to /me
  var _authenticate = function (callback) {

    Camomile.me(function (err, data) {
      var user;
      if (err) {
        user = undefined;
      } else {
        user = data;
      }
      $scope.$apply(function () {
        $scope.user = user;
      });

      // only call callback if it is defined
      callback && callback();
    });
  };

  // authenticate user on load
  _authenticate();

  // login using credentials from the login form
  // then call onLoginCallback (usually set by child controller)
  $scope.credentials = {};
  $scope.login = function () {
    Camomile.login($scope.credentials.username, $scope.credentials.password, function (err) {
      if (!err) { _authenticate(onLoginCallback); }
    });
  };

  // logout
  // then call onLogoutCallabck (usually set by child controller)
  $scope.logout = function () {
    Camomile.logout(function (err) {
      if (!err) { _authenticate(onLogoutCallback); }
    });
  };

}]);
