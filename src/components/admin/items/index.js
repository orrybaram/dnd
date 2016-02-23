module.exports = AdminitemsCtrl;

/** @ngInject */
function AdminitemsCtrl($scope, $uibModal, Items) {
	
	$scope.items = [];
	
	// $scope.open_edit_item_modal = open_edit_item_modal;
	// $scope.open_item_modal = open_item_modal;
	// $scope.delete_item = delete_item;

	$scope.$on('fetched-items', function(evt, items) {
		$scope.items = items;
	});

	Items.get();

	// function delete_item(item_key, idx) {
	// 	items.destroy(item_key).then(function() {
	// 		$scope.items.splice(idx, 1);
	// 	});
	// }

	// function open_edit_item_modal(item) {
 //        console.log(item)
 //        var modalInstance = $uibModal.open({
 //            templateUrl: 'components/modals/edit-item-modal/index.html',
 //            controller: 'EditItemModalCtrl',
 //            size: 'sm',
 //            resolve: {
 //                item: function () {
 //                    return item;
 //                }
 //            }
 //        });
 //    }

 //    function open_item_modal(item) {
 //        var modalInstance = $uibModal.open({
 //            templateUrl: 'components/modals/item-modal/index.html',
 //            controller: 'BaseModalCtrl',
 //            size: 'sm',
 //            resolve: {
 //                item: function () {
 //                    return item;
 //                }
 //            }
 //        });
 //    }
}