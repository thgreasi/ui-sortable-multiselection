angular.module('ui.sortable.multiselection', [])
  .constant('uiSortableMultiSelectionClass', 'ui-sortable-selected')
  .directive('uiSortableSelectable', [
    'uiSortableMultiSelectionClass',
    function(selectedItemClass) {
      return {
        link: function(scope, element/*, attrs*/) {
          element.on('click', function (e) {
            var $this = angular.element(this);

            var $parent = $this.parent();
            var isDisabled = $parent.sortable('option', 'disabled');
            if (isDisabled){
              return;
            }
            var jquerySortableCancelOption = $parent.sortable('option', 'cancel');
            var jquerySortableHandleOption = $parent.sortable('option', 'handle');

            // Respect jQuery UI Sortable's cancel property by testing if element matches selector
            if (jquerySortableCancelOption !== undefined && $this.is(jquerySortableCancelOption)) {
              return;
            }

            // Mimic jQuery UI Sortable's handle property when determining if an item is selected
            if (jquerySortableHandleOption) {
              var validHandle = false;
              
              $parent.find(jquerySortableHandleOption).find('*').addBack().each(function () {
                if (this === e.target) {
                  validHandle = true;
                }
              });

              if (!validHandle) {
                return;
              }
            }

            var sortableMultiSelectState = $parent.data('uiSortableMultiSelectionState') || {};

            var lastIndex = sortableMultiSelectState.lastIndex;
            var index = $this.index();

            if (e.ctrlKey || e.metaKey) {
              $this.toggleClass(selectedItemClass);
            } else if (e.shiftKey && lastIndex !== undefined && lastIndex >= 0) {
              if (index > lastIndex) {
                $parent.children().slice(lastIndex, index + 1).addClass(selectedItemClass);
              } else if(index < lastIndex) {
                $parent.children().slice(index, lastIndex).addClass(selectedItemClass);
              }
            } else {
              $parent.children('.'+selectedItemClass).not($this).removeClass(selectedItemClass);
              $this.toggleClass(selectedItemClass);
            }
            sortableMultiSelectState.lastIndex = index;
            $parent.data('uiSortableMultiSelectionState', sortableMultiSelectState);

            $parent.trigger('ui-sortable-selectionschanged');
          });

          element.parent().on('$destroy', function() {
            console.log('destroy');
            element.parent().removeData('uiSortableMultiSelectionState');
          });
        }
      };
    }
  ])
  .factory('uiSortableMultiSelectionMethods', [
    'uiSortableMultiSelectionClass',
    function (selectedItemClass) {
      function fixIndex (oldPosition, newPosition, x) {
        if (oldPosition < x && (newPosition === undefined || (oldPosition < newPosition && x <= newPosition))) {
          return x - 1;
        } else if (x < oldPosition && newPosition !== undefined && newPosition < oldPosition && newPosition <= x) {
          return x + 1;
        }
        return x;
      }

      function groupIndexes (indexes, oldPosition, newPosition) {
        var above = [],
            below = [];

        for (var i = 0; i < indexes.length; i++) {
          var x = indexes[i];
          if (x < oldPosition) {
            above.push(fixIndex(oldPosition, newPosition, x));
          } else if (oldPosition < x) {
            below.push(fixIndex(oldPosition, newPosition, x));
          }
        }

        return {
          above: above,
          below: below
        };
      }

      function extractModelsFromIndexes (ngModel, indexes) {
        var result = [];
        for (var i = indexes.length - 1; i >= 0; i--) {
          result.push(ngModel.splice(indexes[i], 1)[0]);
        }
        result.reverse();
        return result;
      }

      function extractGroupedModelsFromIndexes (ngModel, aboveIndexes, belowIndexes) {
        var models = {
          below: extractModelsFromIndexes(ngModel, belowIndexes),
          above: extractModelsFromIndexes(ngModel, aboveIndexes)
        };
        return models;
      }

      function combineCallbacks(first,second){
        if(second && (typeof second === 'function')) {
          return function() {
            first.apply(this, arguments);
            second.apply(this, arguments);
          };
        }
        return first;
      }

      return {
        extendOptions: function (sortableOptions) {
          sortableOptions = sortableOptions || {};
          var result = angular.extend({}, this, sortableOptions);

          for (var prop in sortableOptions) {
            if (sortableOptions.hasOwnProperty(prop)) {
              if (this[prop]) {
                if (prop === 'helper') {
                  result.helper = this.helper;
                } else {
                  result[prop] = combineCallbacks(this[prop], sortableOptions[prop]);
                }
              }
            }
          }

          return result;
        },
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

          var selectedIndexes = angular.element.map(selectedElements, function (element) {
            return angular.element(element).index();
          });

          // indexes of the selected siblings
          var indexes = angular.element.map(selectedSiblings, function (element) {
            return angular.element(element).index();
          });

          item.sortableMultiSelect = {
            indexes: indexes,
            selectedIndexes: selectedIndexes
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
        start: function(e, ui) {
          ui.item.sortableMultiSelect.sourceElement = ui.item.parent();

          var sourceModel = ui.item.sortable.sourceModel;
          var indexes = ui.item.sortableMultiSelect.indexes;
          var selectedIndexes = ui.item.sortableMultiSelect.selectedIndexes;
          var models = [];
          var selectedModels = [];
          for (var i = 0, len = selectedIndexes.length; i < len; i++) {
            var index = selectedIndexes[i];
            selectedModels.push(sourceModel[index]);
            if (indexes.indexOf(index) >= 0) {
              models.push(sourceModel[index]);
            }
          }
          ui.item.sortableMultiSelect.models = models;
          ui.item.sortableMultiSelect.selectedModels = selectedModels;
        },
        update: function(e, ui) {
          if (ui.item.sortable.received) {
            if (!ui.item.sortable.isCanceled()) {
              var ngModel = ui.item.sortable.droptargetModel,
                  newPosition = ui.item.sortable.dropindex,
                  models = ui.item.sortableMultiSelect.moved;

              // add the models to the target list
              Array.prototype.splice.apply(
                ngModel,
                [newPosition+ 1, 0]
                .concat(models.below));

              Array.prototype.splice.apply(
                ngModel,
                [newPosition, 0]
                .concat(models.above));
            } else {
              ui.item.sortableMultiSelect.sourceElement.find('> .' + selectedItemClass).show();
            }
          }
        },
        remove: function(e, ui) {
          if (!ui.item.sortable.isCanceled()) {
            var ngModel = ui.item.sortable.sourceModel,
                oldPosition = ui.item.sortable.index;

            var indexes = groupIndexes(ui.item.sortableMultiSelect.indexes, oldPosition);

            // get the models and remove them from the original list
            // the code should run in reverse order,
            // so that the indexes will not break
            ui.item.sortableMultiSelect.moved = extractGroupedModelsFromIndexes(ngModel, indexes.above, indexes.below);
          } else {
            ui.item.sortableMultiSelect.sourceElement.find('> .' + selectedItemClass).show();
          }
        },
        stop: function (e, ui) {
          var sourceElement = ui.item.sortableMultiSelect.sourceElement || ui.item.parent();
          if (!ui.item.sortable.received &&
             // ('dropindex' in ui.item.sortable) &&
             !ui.item.sortable.isCanceled()) {
            var ngModel = ui.item.sortable.sourceModel,
                oldPosition = ui.item.sortable.index,
                newPosition = ui.item.sortable.dropindex;

            var draggedElementIndexes = ui.item.sortableMultiSelect.indexes;
            if (!draggedElementIndexes.length) {
              return;
            }

            if (newPosition === undefined) {
              newPosition = oldPosition;
            }

            var indexes = groupIndexes(draggedElementIndexes, oldPosition, newPosition);

            // get the model of the dragged item
            // so that we can locate its position
            // after we remove the co-dragged elements
            var draggedModel = ngModel[newPosition];
            
            // get the models and remove them from the list
            // the code should run in reverse order,
            // so that the indexes will not break
            var models = extractGroupedModelsFromIndexes(ngModel, indexes.above, indexes.below);
          
            // add the models to the list
            Array.prototype.splice.apply(
              ngModel,
              [ngModel.indexOf(draggedModel) + 1, 0]
              .concat(models.below));

            Array.prototype.splice.apply(
              ngModel,
              [ngModel.indexOf(draggedModel), 0]
              .concat(models.above));

            ui.item.parent().find('> .' + selectedItemClass).removeClass('' + selectedItemClass).show();
          } else if (ui.item.sortable.isCanceled()) {
            sourceElement.find('> .' + selectedItemClass).show();
          }
        }
      };
    }]);