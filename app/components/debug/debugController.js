/**
 * Created by huchetn on 27/05/16.
 */
angular.module("camomileApp.controllers.debug", [])
    .controller('DebugCtrl', ['$scope', '$log', 'Camomile', '$uibModal', '$timeout', 'cappdata',
    function($scope, $log, Camomile, $uibModal, $timeout, cappdata) {
        $scope.c = undefined;
        $scope.cs = [];

        $scope.path = "rootpath";

        $scope.getCs = function () {
            var cb = function (err, data) {
                if (!err) {
                    $scope.cs = data;
                }
            };

            Camomile.getCorpora(cb);
        };

        $scope.getMetadata = function (path) {
            var cb = function (err, data) {
                if (err) {
                    $log.warn('Doesn\'t seem to fetch... ' + err);
                } else {
                    $log.info('It fetched!');
                    $log.info(data);
                }
            };
            path = path === undefined ? $scope.path : path;

            Camomile.getCorpusMetadata($scope.c, path, cb);
        };

        $scope.setMetadata = function () {
            var cb = function (err, data) {
                if (err) {
                    $log.warn('Doesn\'t seem to work... ' + err);
                } else {
                    $log.info('It worked!');
                }
            };
            
            var obj = {
                john: 1,
                nonjohn: "mais oyui c'est claill"
            };

            $scope.getMetadata($scope.path + ".john");
            Camomile.deleteCorpusMetadata($scope.c, $scope.path);
            Camomile.setCorpusMetadata($scope.c, obj, $scope.path, cb);
        };

        $scope.getCs();
    }]);