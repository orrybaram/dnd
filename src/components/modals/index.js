angular.module("dnd.modals", [])
	.controller('BaseModalCtrl', require("./base-modal-ctrl"))
	.controller('CreateFeatModalCtrl', require("./create-feat-modal"))
	.controller('EditFeatModalCtrl', require("./edit-feat-modal"))
;