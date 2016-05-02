angular.module('camomileApp.controllers.objects', [])
.controller('ObjectsCtrl', function ($scope, $interval, Camomile) {
  $scope.corpora = [];
  $scope.layers = [];
  $scope.objects = [];
  $scope.endroits = [];

  //$scope.corpusSelected = undefined;
  //$scope.layerSelected = undefined;
  $scope.objectSelected = undefined;
  //$scope.endroitSelected = undefined;

  $scope.fillDB = function () { // TODO: change media references to match _id medium of mongodb
    var datas = {
      "objet": [
        {"Salle": "1", "Etage": "A", "Endroit": 6, "Id_texte": "Triomphe de Bacchus", "media": [1284, 1285, 1286], "sous_partie": "", "Id_POI_adulte": "1", "id_musee": "", "type": "", "Id_POI_enfant": "51"},
        {"Salle": "3", "Etage": "A", "Endroit": 8, "Id_texte": "Fondation de lyon", "media": [1326], "sous_partie": "", "Id_POI_adulte": "2", "id_musee": "", "type": "papier", "Id_POI_enfant": "52"}
      ],
      "endroit": {
        6: 'A_1',
        8: 'A_3'
      }
    };
    Camomile.setCorpusMetadata($scope.corpusSelected, datas);
  }

  $scope.getAllCorpora = function() {
    Camomile.getCorpora(function(err, data) {
      if (err) {
        $scope.corpora = [];
      } else {
        $scope.$apply(function() {
          $scope.corpora = data;
        });
      }
    });
  };

  $scope.getAllLayers = function() {
    Camomile.getLayers(function(err, data) {
      if (err) {
        $scope.layers = [];
      } else {
        $scope.$apply(function() {
          $scope.layers = data;
        });
      }
    }, {
      filter: {
        id_corpus: $scope.corpus
      }
    });
  };

  $scope.getAllObjects = function () {
    var callback = function (err, data) {
      if (err) {
        console.warn('Error');
      } else {
        console.log(data);
        $scope.$apply(function () {
          $scope.objects = data;
        });
      }
    };
    Camomile.getCorpusMetadata($scope.corpusSelected, "objet", callback);
  };

  $scope.getAllEndroits = function () {
    var callback = function (err, data) {
      if (err) {
        console.warn('Error');
      } else {
        console.log(data);
        $scope.$apply(function () {
          $scope.endroits = data;
        });
      }
    };
    Camomile.getCorpusMetadata($scope.corpusSelected, "endroit", callback);
  };

  $scope.getMedium = function (medium_id) {
    return Camomile.getMediumURL($scope.corpusSelected, medium_id);
  };

  $scope.addObject = function () {
    var a = '{"objet":[{"Salle":"4","Etage":"A","Endroit":5,"Id_texte":"","media":[1361,1362],"sous_partie":"dxc3xa9tail","Id_POI_adulte":"/","id_musee":"","type":"2 sur 2","Id_POI_enfant":"/"},{"Salle":"1","Etage":"A","Endroit":6,"Id_texte":"Triomphe de Bacchus","media":[1284,1285,1286],"sous_partie":"","Id_POI_adulte":"1","id_musee":"","type":"","Id_POI_enfant":"51"}]}';
    var obj = JSON.parse(a);
    var callback = function (err, data) {
      if (err) {
        console.warn('Error');
      } else {
        console.log(data);
      }
    };
    Camomile.setCorpusMetadata($scope.corpusSelected, obj, callback);
  };

  $scope.init = function () {
    $scope.getAllCorpora();
  };

  $scope.init();

  $scope.$watch('corpusSelected', function () {
    if ($scope.corpusSelected) {
      $scope.getAllLayers();
      $scope.getAllObjects();
    }
  });
});
