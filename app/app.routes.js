angular.module('app.routes', [
    'ngRoute'
])
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider
            .when('/backoffice', {
                templateUrl: 'app/components/backoffice/backofficeView.html',
                controller: 'BackofficeCtrl'
            })
            .when('/home', {
                templateUrl: 'app/components/home/homeView.html',
                controller: 'BrowseCtrl'
            })
            .when('/objects', {
                templateUrl: 'app/components/objects/objectsView.html',
                controller: 'ObjectsCtrl'
            })
            .when('/indexation', {
                templateUrl: 'app/components/indexation/indexationView.html',
                controller: 'IndexationCtrl'
            })            
            .when('/segmentation', {
                templateUrl: 'app/components/segmentation/segmentationView.html',
                controller: 'SegmentationCtrl'
            })
            .when('/debug', {
                templateUrl: 'app/components/debug/debugView.html',
                controller: 'DebugCtrl'
            })
            .otherwise({
                redirectTo: '/home'
            });
    }]);