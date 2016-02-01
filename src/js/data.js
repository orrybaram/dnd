const _items = require("data/items");
const _powers = require("data/powers");
// const _feats = require("data/feats");

angular.module("dnd.data", [])
	.factory("Items", Items)
	.factory("Powers", Powers)
	.factory("Feats", Feats)
;

function Items() {
	
	return _items
}
function Powers() {
	return _powers
}
/** @ngInject */
function Feats($http) {
	
	var feats = [];

	return {
		feats: feats,
		get: get
	};

	function get() {
		return $http.get('/api/v1/feats').then(function(response) {
			feats = response.data;
			return feats;
		});
	}
}

