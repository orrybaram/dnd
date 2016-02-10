angular.module("dnd.data", [])
	.factory("Items", require("./items"))
	.factory("Powers", require("./powers"))
	.factory("Feats", require("./feats"))
;