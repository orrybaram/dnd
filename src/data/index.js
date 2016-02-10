angular.module("dnd.data", [])
	.factory("Items", require("./items"))
	.factory("Powers", require("./feats"))
	.factory("Feats", require("./feats"))
;