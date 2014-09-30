var myapp = angular.module('sortableApp', ['ui.sortable', 'ui.sortable.multiselection']);


myapp.controller('sortableController', function ($scope, uiSortableMultiSelectionMethods) {
  var tmpList = [];
  
  for (var i = 1; i <= 6; i++){
    tmpList.push({
      text: 'Item ' + i,
      value: i
    });
  }
  
  $scope.list = tmpList;
  
  $scope.sortingLog = [];
  
  $scope.sortableOptions = {
    helper: uiSortableMultiSelectionMethods.helper,
    update: function(e, ui) {
      if ($scope.lockNodesWithTwo) {
        var movesTwo = ui.item.scope().list
          .filter(function(x,i) { return ui.item.sortableMultiSelect.indexes.concat(ui.item.sortable.index).indexOf(i) >= 0; })
          .filter(function(x) { return x.text.indexOf('2') >= 0; })
          .length;
        if (movesTwo) {
          ui.item.sortable.cancel();
        }
      }
    },
    stop: function(e, ui) {
      uiSortableMultiSelectionMethods.stop(e, ui);

      // this callback has the changed model
      var logEntry = tmpList.map(function(i){
        return i.value;
      }).join(', ');
      $scope.sortingLog.push('Stop: ' + logEntry);
    }
  };
});