const BaseModalCtrl = require("../base-modal-ctrl");

module.exports = CreateFeatModalCtrl;

/** @ngInject */
function CreateFeatModalCtrl($scope, $stateParams, $uibModalInstance, Feats, item) {
	BaseModalCtrl.apply(this, arguments);
	var character_key = $stateParams.character_key;
	
	$scope.submit_new_feat = submit_new_feat;

	function submit_new_feat() {
		Feats.create_new($scope.feat).then(function(response) {
			Feats.add(response.data, character_key);
			
		});
	}
}