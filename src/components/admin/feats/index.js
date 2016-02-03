module.exports = AdminFeatsCtrl;

/** @ngInject */
function AdminFeatsCtrl($scope, $uibModal, Feats) {
	
	$scope.feats = [];
	
	$scope.open_edit_feat_modal = open_edit_feat_modal;
	$scope.open_feat_modal = open_feat_modal;
	$scope.delete_feat = delete_feat;

	$scope.$on('fetched-feats', function(evt, feats) {
		$scope.feats = feats;
	});

	Feats.get();

	function delete_feat(feat_key, idx) {
		Feats.destroy(feat_key).then(function() {
			$scope.feats.splice(idx, 1);
		});
	}

	function open_edit_feat_modal(feat) {
        console.log(feat)
        var modalInstance = $uibModal.open({
            templateUrl: 'components/modals/edit-feat-modal/index.html',
            controller: 'EditFeatModalCtrl',
            size: 'sm',
            resolve: {
                item: function () {
                    return feat;
                }
            }
        });
    }

    function open_feat_modal(feat) {
        var modalInstance = $uibModal.open({
            templateUrl: 'components/modals/item-modal/index.html',
            controller: 'BaseModalCtrl',
            size: 'sm',
            resolve: {
                item: function () {
                    return feat;
                }
            }
        });
    }
}