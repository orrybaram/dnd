angular.module('directives', [])

.directive('onFormChange',function($parse) {
	return {
		link: function(scope, el, attrs) {
			console.log(attrs)
			var method = $parse(attrs.onFormChange);
			el.on('change', function() {
				method(scope);
			})
		}
	}
})