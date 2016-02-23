const BaseModalCtrl = require("../base-modal-ctrl");

module.exports = CreateFeatModalCtrl;

/** @ngInject */
function CreateFeatModalCtrl($scope, $uibModalInstance, item, $stateParams, $timeout, Feats, Character) {
	BaseModalCtrl.apply(this, arguments);
	var character_key = $stateParams.character_key;
	
	$scope.submit_new_feat = submit_new_feat;

	function submit_new_feat() {
		Feats.create_new($scope.feat)
			.then(function(response) {
				console.log(response)
				return Feats.add(response.data, character_key);
			})
			.then(function(response) {
				$timeout(function() {
					return Character.fetch();	
				}, 250)

				$scope.close();
			})
		;
	}
}