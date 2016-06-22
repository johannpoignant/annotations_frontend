angular.module('camomileApp.controllers.indexation', [])
    .controller('IndexationCtrl', function ($scope, $interval, $sce, $timeout, Camomile, cappdata) {
        $scope.api = {};

        var refresh = function () {
            cappdata.clean(); // On clean la facto, pour éviter les restes d'autres composants
            cappdata.get('queues'); // On update les queues dispos
            cappdata.registerObserver(updateData); // On register le composant
            $scope.form = {};
        };

        $scope.$parent.onLogin(refresh);

        var updateData = function (res) { // Callback de refresh
            $timeout(function () {
                $scope.cappdata = cappdata;
                $scope.api.loader.finished();

                if (res.type == "dequeue") {
                    $scope.cappdata.get("medium", $scope.cappdata.currentQueueItem.id_test);
                    for (m of $scope.cappdata.currentQueueItem.ids_train) {
                        $scope.cappdata.get('medium', m.id_train);
                    }
                }

                if (res.type == "get" && res.type == "medium" && $scope.cappdata.mediaSelected[1]) {
                    console.log($scope.cappdata.mediaSelected);

                    $scope.ImageTrain = $scope.cappdata.mediaSelected.slice(1, $scope.cappdata.mediaSelected.lenght);
                }
            }, 0);
        };

        refresh();

        $scope.loadNextAnnotation = function() {
            if ($scope.queueIn) {
                $scope.cappdata.dequeue($scope.queueIn);
            }
        };

        $scope.sendAnnotation = function() {
            if ($scope.queueOut) {
                console.log($scope.form);
                
                $scope.cappdata.enqueue($scope.queueOut, $scope.form, function () {
                    $scope.form = {};
                });

                $scope.loadNextAnnotation();
            }
        };
    });
