const BaseModalCtrl = require("../base-modal-ctrl");

module.exports = CreateFeatModalCtrl;

/** @ngInject */
function CreateFeatModalCtrl($scope, $uibModalInstance, item) {
	BaseModalCtrl.apply(this, arguments);
}