angular.module('directives', [])

.directive('onFormChange',function($parse, $timeout) {
	return {
		link: function(scope, el, attrs) {
			var method = $parse(attrs.onFormChange);
			el.on('change', function() {
				$timeout(function() {
					method(scope);	
				}, 500)
			})
		}
	}
})
.directive("fileread", function () {
    return {
        scope: {
            fileread: "="
        },
        link: function (scope, element, attributes) {
            element.bind("change", function (changeEvent) {
                var reader = new FileReader();
                reader.onload = function (loadEvent) {
                    scope.$apply(function () {
                        scope.fileread = loadEvent.target.result;
                    });
                }
                reader.readAsDataURL(changeEvent.target.files[0]);
            });
        }
    }
})
.directive("fakeClick", function() {
	return {
		link: function(scope, element, attr) {
			element.on('click', function() {
				document.getElementById(attr.fakeClick).click();
			})
		}
	}
})

.directive('dndList', function() {

    return function(scope, element, attrs) {

    	// variables used for dnd
        var toUpdate;
        var startIndex = -1;

        // watch the model, so we always know what element
        // is at a specific position
        scope.$watch(attrs.dndList, function(value) {
            toUpdate = value;
        }, true);

        // use jquery to make the element sortable (dnd). This is called
        // when the element is rendered
        $(element[0]).sortable({
            items: '> li',
            start: function(event, ui) {
                // on start we define where the item is dragged from
                startIndex = ($(ui.item).index());
            },
            stop: function(event, ui) {
                // on stop we determine the new index of the
                // item and store it there
                var newIndex = ($(ui.item).index());
                var toMove = toUpdate[startIndex];
                toUpdate.splice(startIndex, 1);
                toUpdate.splice(newIndex, 0, toMove);

                // we move items in the array, if we want
                // to trigger an update in angular use $apply()
                // since we're outside angulars lifecycle
                scope.$apply(scope.model);
            },
            axis: 'xy'
        })
    }
})