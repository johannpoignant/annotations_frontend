angular.module('camomileApp.directives.loader', [
    "ngAnimate"
])
    .directive('camomileLoader', function (camomileToolsConfig) {
        return {
            restrict: 'AE',
            scope: {
                api: '=?'
            },
            templateUrl: camomileToolsConfig.moduleFolder + 'loader/loaderView.html',
            controller: function ($scope) {
                $scope.componentsLoading = 0;
                $scope.load = false;
                $scope.styleSpinner = {display: 'none'};
                $scope.styleLoader = {display: 'none'};

                $scope.loading = function (nb) {
                    nb = nb === undefined ? 1 : nb;

                    if (!$scope.load) {
                        $scope.styleSpinner = {display: 'block'};
                        $scope.styleLoader = {display: 'block'};
                        $scope.load = true;
                    }

                    $scope.componentsLoading += nb;
                };

                $scope.finished = function () {
                    if ($scope.componentsLoading > 0) {
                        $scope.componentsLoading -= 1;
                    }

                    if ($scope.componentsLoading == 0 && $scope.load) {
                        $scope.styleSpinner = {display: 'none'};
                        $scope.styleLoader = {display: 'none'};
                        $scope.load = false;
                    }
                };

                $scope.api.loader = $scope;
            },
            link: function (scope, elem, attrs) {
                // Nothing
            }
        }
    });