angular.module('directives.powerCard', [])
	.directive('powerCard', powerCard)
;

function powerCard() {
	return {
		templateUrl: "components/cards/power-card.html",
		link: function(scope) {
			scope.tapCard = function($index) {
				console.log("ahhhh")
			}
		}
	}
}