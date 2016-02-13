var myapp = angular.module('sortableApp', ['ui.sortable', 'ui.sortable.multiselection'], function ($compileProvider) {
  if (typeof $compileProvider.debugInfoEnabled === 'function') {
    $compileProvider.debugInfoEnabled(false);
  }
});


myapp.controller('sortableController', function ($scope, uiSortableMultiSelectionMethods) {
  function makeList (letter) {
    var tmpList = [];

    for (var i = 1; i <= 6; i++){
      tmpList.push({
        text: 'Item ' + i + letter,
        value: i + letter
      });
    }
    return tmpList;
  }
  
  $scope.list1 = makeList('a');
  $scope.list2 = makeList('b');

  $scope.rawScreens = [
    $scope.list1,
    $scope.list2
  ];
  
  
  $scope.sortingLog = [];
  
  $scope.sortableOptions = uiSortableMultiSelectionMethods.extendOptions({
    update: function(e, ui) {
      if ($scope.lockNodesWithTwo) {
        // if it's not declared as received yet
        // aka if we are in the update callback 
        // of the source list
        if (!ui.item.sortable.received) {
          var movesTwo = ui.item.scope().$eval(ui.item.parent().attr('ng-model'))
            .filter(function(x,i) { return ui.item.sortableMultiSelect.indexes.concat(ui.item.sortable.index).indexOf(i) >= 0; })
            .filter(function(x) { return x.text.indexOf('2') >= 0; })
            .length;
          if (movesTwo) {
            ui.item.sortable.cancel();
          }
        }
      }
    },
    connectWith: '.items-container'
  });
  
  $scope.logModels = function () {
    $scope.sortingLog = [];
    for (var i = 0; i < $scope.rawScreens.length; i++) {
      var logEntry = $scope.rawScreens[i].map(function (x) {
        return x.text;
      }).join(', ');
      logEntry = 'container ' + (i+1) + ': ' + logEntry;
      $scope.sortingLog.push(logEntry);
    }
  };
});

myapp.controller('dummyController', function ($scope) {
  // this is required since ui-sortable v0.12.x is not creating a new scope
});