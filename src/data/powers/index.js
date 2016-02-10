module.exports = Powers;

/** @ngInject */
function Powers($http, $rootScope) {
	
	var powers = [];

	return { get, add, edit, powers, fetch, search, remove, destroy, create_new };

	function get() {
		if(powers.length) {
			$rootScope.$broadcast('fetched-power', powers);
		}
		return fetch();
	}

	function fetch() {
		return $http.get('/api/v1/power').then(function(response) {
			powers = response.data;
			$rootScope.$broadcast('fetched-powers', powers);
			return powers;
		});
	}

	function search(query) {
		return $http.post('/api/v1/power/search', {query_string: query}).then(function(data) {
			console.log(data.data.results);
			return data.data.results;
		});
	}

	function edit(power) {
		return $http.post('/api/v1/power', power).then(function() {
			$rootScope.$broadcast('power-editted');
		});
	}

	function add(data, character_key) {
		return $http.post('/api/v1/character/' + character_key + '/power/add/', data);
    }

    function remove(power_id, character_key) {
		return $http.post('/api/v1/character/' + character_key + '/power/' + power_id + '/delete/');
	}

	function destroy(power_id) {
		return $http.post(`/api/v1/power/${power_id}/delete/`).then(function(data) {
			$rootScope.$broadcast('power-destroyed');
		}, function(error) {
			console.log(error);
		});
	}

	function create_new(power, character_key) {
		var template = `<h1 class=player>${power.name}</h1>
						<p class="flavor">
							<b>${power.tier} Tier</b><br>
							<b> Prerequisite</b>: ${power.prerequisites}<br>
							<b> Benefit</b>: ${power.benefit}
						</p>`;

		var postData = {
			id: (power.length + 2).toString(),
			name: power.name,
			html: template
		};
		return $http.post('/api/v1/power/', postData);
	}
}

