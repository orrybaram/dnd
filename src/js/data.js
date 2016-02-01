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
		get: get,
		add: add,
		remove: remove,
		create_new: create_new
	};

	function get() {
		return $http.get('/api/v1/feats').then(function(response) {
			feats = response.data;
			return feats;
		});
	}

	function add(data, character_key) {
		return $http.post('/api/v1/character/' + character_key + '/feats/add/', data);
    }

    function remove(feat_id, character_key) {
		return $http.post('/api/v1/character/' + character_key + '/feats/' + feat_id + '/delete/');
	}

	function create_new(feat, character_key) {
		var template = `<h1 class=player>${feat.name}</h1>
						<p class="flavor">
							<b>${feat.tier}</b><br>
							<b> Prerequisite</b>: ${feat.prerequisites}<br>
							<b> Benefit</b>: ${feat.benefit}
						</p>`;

		var postData = {
			id: (feats.length + 2).toString(),
			name: feat.name,
			html: template
		}
		return $http.post('/api/v1/feats/', postData);
	}
}

