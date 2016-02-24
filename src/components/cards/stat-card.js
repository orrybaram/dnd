angular.module('directives.statCard', [])
	.directive('statCard', statCard)
;

function statCard() {
	return {
		scope: {
			'character': '=character'
		},
		templateUrl: "components/cards/stat-card.html",
		controller: statCtrl
	};
}

/** @ngInject */
function statCtrl($scope) {
	console.log($scope)
}