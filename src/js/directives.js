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

.directive("fileread",function () {
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