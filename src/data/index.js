// const _items = require("data/items");
// const _powers = require("data/powers");

angular.module("dnd.data", [])
	.factory("Items", Items)
	.factory("Powers", Powers)
	.factory("Feats", require("./feats"))
;

function Items() {
	return {}
}
function Powers() {
	return {}
}