module.exports = Items;

/** @ngInject */
function Items($http, $rootScope) {
	
	var items = [];

	return {
		get: get,
		add: add,
		edit: edit,
		items: items,
		fetch: fetch,
		search:search,
		remove: remove,
		destroy: destroy,
		create_new: create_new
	};

	function get() {
		if(item.length) {
			$rootScope.$broadcast('fetched-item', item);
		}
		fetch();
	}

	function fetch() {
		return $http.get('/api/v1/item').then(function(response) {
			item = response.data;
			$rootScope.$broadcast('fetched-item', item);
			return item;
		});
	}

	function search(query) {
		console.log(query)
		return $http.post('/api/v1/item/search', {query_string: query}).then(function(data) {
			console.log(data);
		});
	}

	function edit(feat) {
		return $http.post('/api/v1/item', feat).then(function() {
			$rootScope.$broadcast('feat-editted');
		});
	}

	function add(data, character_key) {
		return $http.post('/api/v1/character/' + character_key + '/item/add/', data);
    }

    function remove(feat_id, character_key) {
		return $http.post('/api/v1/character/' + character_key + '/item/' + feat_id + '/delete/');
	}

	function destroy(feat_id) {
		return $http.post(`/api/v1/item/${feat_id}/delete/`).then(function(data) {
			$rootScope.$broadcast('feat-destroyed');
		}, function(error) {
			console.log(error);
		});
	}

	function create_new(feat, character_key) {
		var template = `<h1 class=player>${feat.name}</h1>
						<p class="flavor">
							<b>${feat.tier} Tier</b><br>
							<b> Prerequisite</b>: ${feat.prerequisites}<br>
							<b> Benefit</b>: ${feat.benefit}
						</p>`;

		var postData = {
			id: (item.length + 2).toString(),
			name: feat.name,
			html: template
		};
		return $http.post('/api/v1/item/', postData);
	}
}

