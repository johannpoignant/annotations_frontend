angular.module('camomileApp.controllers.objects', [])
    .controller('ObjectsCtrl', function ($scope, $interval, $sce, $timeout, Camomile, cappdata) {
        $scope.api = {};

        var refresh = function () {
            cappdata.clean(); // On clean la facto, pour éviter les restes d'autres composants
            cappdata.get('corpora'); // On update les corpus dispos
            cappdata.registerObserver(updateData); // On register le composant
        };

        $scope.$parent.onLogin(refresh);

        var updateData = function () { // Callback de refresh
            $timeout(function () {
                $scope.cappdata = cappdata;
                $scope.api.loader.finished();
                //$scope.api.popup.showMessage("Chargement terminé.", 3000, "#07f");
            }, 0);
        };

        refresh();

        $scope.updateObjects = function () { // Lorsque l'utilisateur sélectionne un corpus, on update les layers & mt
            if ($scope.corpus) {
                $scope.api.loader.loading();
                cappdata.get('layers', $scope.corpus);
                cappdata.get('metadata', $scope.corpus, ['objet', 'endroit']);
            }
        };

        $scope.updateObject = function () { // Lorsqu'il choisi un object ou un layer, on doit refresh les media
            cappdata.resetMedium();
            if ($scope.object) {
                for (m of $scope.object.media) {
                    cappdata.get('medium', m);
                }
            }
        };
    })
    // Filtre de debug, à enlever en prod
    .filter('currentdate',['$filter',  function($filter) {
        return function() {
            return $filter('date')(new Date(), 'hh:mm:ss MMMM');
        };
    }]);
