var camomileApp = angular.module('camomileApp', ['camomile.controllers',
    'camomile.services',
    'camomileApp.production',
    'camomileApp.controllers.browse',
    'ngRoute'
])
.config(['$routeProvider', function($routeProvider) {
    $routeProvider
      .when('/backoffice', {
        templateUrl: 'views/backoffice.html',
        controller: ''
      })
      .when('/list', {
        templateUrl: 'views/list.html',
        controller: 'BrowseCtrl'
      })
      .otherwise({
        redirectTo: '/list'
      });
}]);
