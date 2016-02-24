angular.module('directives.featCard', [])
	.directive('featCard', featCard)
;

function featCard() {
	return {
		templateUrl: "components/cards/feat-card.html",
		link: function(scope) {
			scope.tapCard = function($event, $index) {};
		}
	}
}