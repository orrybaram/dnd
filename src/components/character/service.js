angular.module('dnd.character', [])
	.factory('Character', Character)


/** @ngInject */
function Character($rootScope, $http) {

	var data;

	return {
		data: data,
		get: get,
		fetch: fetch,
		destroy: destroy,
		update: update,
	};

	function get() {
		return data;
	}

	function fetch(key) {
		key = key || data.key
		return $http.get(`/api/v1/character/${key}`).then(function(response) {
            data = response.data.character;
            $rootScope.$broadcast('fetched-character', data);
            return data;
		});
	}

	function destroy(key) {
		key = key || data.key;
		return $http.post(`/api/v1/character/${key}/delete`).then(function(response) {
	        console.log(response);
	    }, function(err) {
	        alert(err.data.error);
	    });	
	}

	function update(postData, key) {
		key = key || data.key;
		return $http.post(`/api/v1/character/${key}/update/`, postData);
	}
}