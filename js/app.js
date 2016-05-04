var camomileApp = angular.module('camomileApp', ['camomile.controllers',
    'camomile.services',
    'camomileApp.production',
    'camomileApp.controllers.browse',
    'camomileApp.controllers.backoffice',
    'camomileApp.controllers.objects',
    'camomileApp.config.directives',
    'ngRoute',
    'ui.bootstrap',
    'ngAnimate',
    'json-tree'
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
        templateUrl: 'views/objects.html',
        controller: 'ObjectsCtrl'
      })
      .otherwise({
        redirectTo: '/list'
      });
}]);
