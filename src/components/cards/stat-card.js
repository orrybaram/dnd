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
function statCtrl($scope, Character) {
	console.log($scope)

	$scope.getAbilModifier = Character.getAbilModifier;
    $scope.getInitiativeTotal = Character.getInitiativeTotal;
    $scope.getHalfLevel = Character.getHalfLevel;
    $scope.roundDown = Character.roundDown;
    $scope.getBloodied = Character.getBloodied;
    $scope.getTotalAbilityScore = Character.getTotalAbilityScore;
    $scope.getDefenseTotal = Character.getDefenseTotal;
    $scope.getLevel = Character.getLevel;
    $scope.getSpeed = Character.getSpeed;
    $scope.getSkillTotal = Character.getSkillTotal;
}