// const _items = require("data/items");
// const _powers = require("data/powers");

angular.module("dnd.data", [])
	.factory("Items", require("./items"))
	.factory("Powers", Powers)
	.factory("Feats", require("./feats"))
;

function Powers() {
	return []
}