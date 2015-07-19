ui-sortable-multiselection
==========================

Provide multiple element sorting in UI-Sortable

[Simple Demo pen](http://codepen.io/thgreasi/pen/mJAcL)

[Connected Lists Demo pen](http://codepen.io/thgreasi/pen/FJrxo)

## ui.item.sortableMultiSelect API documentation

The `ui` argument of the available callbacks gets enriched with some extra properties as specified below:

### indexes
Type: [Array](http://api.jquery.com/Types/#Array)<[Integer](http://api.jquery.com/Types/#Integer)>  
Holds the original indexes of the items dragged.

### moved
Type: [Array](http://api.jquery.com/Types/#Array)<[Object](http://api.jquery.com/Types/#Object)> /`undefined`  
Holds the models of the dragged items only when a sorting happens between two connected ui-sortable elements.

### sourceElement
Type: [jQuery](http://api.jquery.com/Types/#jQuery)  
Holds the ui-sortable element that the dragged item originated from.
