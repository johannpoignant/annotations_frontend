var camomileApp = angular.module('camomileApp', ['camomile.controllers',
    'camomile.services',
    'camomileApp.production',
    'camomileApp.controllers.browse',
    'camomileApp.controllers.backoffice',
    'camomileApp.directives',
    'ngRoute',
    'ui.bootstrap',
    'ngAnimate'
])
.config(['$routeProvider', function($routeProvider) {
    $routeProvider
      .when('/backoffice', {
        templateUrl: 'views/backoffice.html',
        controller: 'BackofficeCtrl'
      })
      .when('/list', {
        templateUrl: 'views/list.html',
        controller: 'BrowseCtrl'
      })
      .when('/objects', {
        templateUrl: '',
        controller: ''
      })
      .otherwise({
        redirectTo: '/list'
      });
}]);
