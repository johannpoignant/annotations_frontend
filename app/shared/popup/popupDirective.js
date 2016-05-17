angular.module('camomileApp.directives.popup', [
    "ngAnimate"
])
    .directive('camomilePopup', function (camomileToolsConfig) {
        return {
            restrict: 'AE',
            scope: {
                api: '=?'
            },
            templateUrl: camomileToolsConfig.moduleFolder + 'popup/popupView.html',
            controller: function ($scope) {
                // Do what you have to do

                $scope.api.popup = $scope;
            },
            link: function (scope, elem, attrs) {
                // Nothing
            }
        }
    });