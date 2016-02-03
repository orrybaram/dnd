const BaseModalCtrl = require("../base-modal-ctrl");

module.exports = EditFeatModalCtrl;

/** @ngInject */
function EditFeatModalCtrl($scope, $uibModalInstance, item, $stateParams, $timeout, Feats, Character) {
	BaseModalCtrl.apply(this, arguments);
	var character_key = $stateParams.character_key;
	
	$scope.feat = item;
	$scope.edit_feat = edit_feat;

	function edit_feat() {
		Feats.edit($scope.feat).then(function() {
			$scope.close();
		});
	}
}