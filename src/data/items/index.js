module.exports = Items;

/** @ngInject */
function Items($http, $rootScope) {
	
	var items = [];

	return { get, add, edit, items, fetch, search, remove, destroy, create_new };

	function get() {
		if(items.length) {
			$rootScope.$broadcast('fetched-item', items);
		}
		return fetch();
	}

	function fetch() {
		return $http.get('/api/v1/item').then(function(response) {
			items = response.data;
			$rootScope.$broadcast('fetched-items', items);
			return items;
		});
	}

	function search(query) {
		return $http.post('/api/v1/item/search', {query_string: query}).then(function(data) {
			console.log(data.data.results);
			return data.data.results;
		});
	}

	function edit(item) {
		return $http.post('/api/v1/item', item).then(function() {
			$rootScope.$broadcast('item-editted');
		});
	}

	function add(data, character_key) {
		return $http.post('/api/v1/character/' + character_key + '/item/add/', data);
    }

    function remove(item_id, character_key) {
		return $http.post('/api/v1/character/' + character_key + '/item/' + item_id + '/delete/');
	}

	function destroy(item_id) {
		return $http.post(`/api/v1/item/${item_id}/delete/`).then(function(data) {
			$rootScope.$broadcast('item-destroyed');
		}, function(error) {
			console.log(error);
		});
	}

	function create_new(item, character_key) {
		var template = `<h1 class=player>${item.name}</h1>
						<p class="flavor">
							<b>${item.tier} Tier</b><br>
							<b> Prerequisite</b>: ${item.prerequisites}<br>
							<b> Benefit</b>: ${item.benefit}
						</p>`;

		var postData = {
			id: (item.length + 2).toString(),
			name: item.name,
			html: template
		};
		return $http.post('/api/v1/item/', postData);
	}
}

