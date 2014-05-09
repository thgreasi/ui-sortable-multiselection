angular.module('ui.sortable.multiselection', [])
  .constant('uiSortableMultiSelectionClass', 'ui-sortable-selected')
  .directive('uiSortableSelectable', [
    'uiSortableMultiSelectionClass',
    function(selectedItemClass) {
      return {
        link: function(scope, element/*, attrs*/) {
          element.on('click', function (e) {
            if (e.ctrlKey || e.metaKey) {
              var $this = angular.element(this);
              $this.toggleClass(selectedItemClass);
            }
          });
        }
      };
    }
  ])
  .factory('uiSortableMultiSelectionMethods', [
    'uiSortableMultiSelectionClass',
    function (selectedItemClass) {
      return {
        helper: function (e, item) {
          // when starting to sort an unhighlighted item ,
          // deselect any existing highlighted items
          if (!item.hasClass(selectedItemClass)) {
              item.addClass(selectedItemClass)
                .siblings()
                .removeClass(selectedItemClass);
          }

          var selectedElements = item.parent().children('.' + selectedItemClass);
          var selectedSiblings = item.siblings('.' + selectedItemClass);

          // indexes of the selected siblings
          var indexes = angular.element.map(selectedSiblings, function (element) {
            return angular.element(element).index();
          });

          item.sortableMultiSelect = {
            indexes: indexes
          };

          // Clone the selected items and to put them inside the helper
          var elements = selectedElements.clone();

          // like `helper: 'clone'` does, hide the dragged elements
          selectedSiblings.hide();

          // Create the helper to act as a bucket for the cloned elements
          var helperTag = item[0].tagName;
          var helper = angular.element('<' + helperTag + '/>');
          return helper.append(elements);
        },
        stop: function (e, ui) {
          var ngModel = ui.item.parent().scope().$eval(ui.item.parent().attr('ng-model')),
              oldPosition = ui.item.sortable.index,
              newPosition = ui.item.sortable.dropindex;
          
          function fixIndex (x) {
            if (oldPosition < newPosition && oldPosition < x && x <= newPosition) {
              return x - 1;
            } else if (newPosition < oldPosition && newPosition <= x && x < oldPosition) {
              return x + 1;
            }
            return x;
          }

          function groupIndexes (indexes) {
            var above = [],
                below = [];

            for (var i = 0; i < indexes.length; i++) {
              var x = indexes[i];
              if (x < oldPosition) {
                above.push(fixIndex(x));
              } else if (oldPosition < x) {
                below.push(fixIndex(x));
              }
            }

            return {
              above: above,
              below: below
            };
          }

          function getModelsFromIndexes (indexes) {
            var result = [];
            for (var i = indexes.length - 1; i >= 0; i--) {
              result.push(ngModel.splice(indexes[i], 1)[0]);
            }
            result.reverse();
            return result;
          }

          var draggedElementIndexes = ui.item.sortableMultiSelect.indexes;
          if (!draggedElementIndexes.length) {
            return;
          }

          var indexes = groupIndexes(draggedElementIndexes);

          // get the model of the dragged item
          // so that we can locate its position
          // after we remove the co-dragged elements
          var draggedModel = ngModel[newPosition];
          
          // the code should run in reverse order,
          // so that the indexes will not break
          var models = {
            below: getModelsFromIndexes(indexes.below),
            above: getModelsFromIndexes(indexes.above)
          };
        
          Array.prototype.splice.apply(
            ngModel,
            [ngModel.indexOf(draggedModel) + 1, 0]
            .concat(models.below));

           Array.prototype.splice.apply(
            ngModel,
            [ngModel.indexOf(draggedModel), 0]
            .concat(models.above));

          ui.item.parent().find('> .' + selectedItemClass).removeClass('' + selectedItemClass).show();
        }
      };
    }]);