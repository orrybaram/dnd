module.exports = AdminCtrl;

/** @ngInject */
function AdminCtrl($scope, Feats) {
	Feats.get();
}