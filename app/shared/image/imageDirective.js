angular.module('camomileApp.directives.image', [])
    .directive('camomileImage', function ($interval, camomileToolsConfig) {
        return {
            restrict: 'AE',
            template: '<img ng-src="{{src}}" ng-style="style">',
            require: '^camomileBox',
            scope: {
                src: '@'
            },
            controller: function ($scope) {
                $scope.api = {};
                $scope.api.image = {};
                $scope.style = {
                    width: "100%",
                    height: "100%"
                };
            },
            link: function (scope, elem, attrs, controllerInstance) {
                scope.dataCtrl = controllerInstance;

                scope.api.refresh = function () {
                    scope.api.dimensions = {
                        width: elem.find('img').width(),
                        height: elem.find('img').height()
                    };
                    if (scope.dataCtrl.apis.canvas)
                        scope.dataCtrl.apis.canvas.refresh();
                };

                controllerInstance.apis.image = scope.api;
                controllerInstance.apis.video = undefined;
            }
        }
    });
