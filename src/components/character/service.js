angular.module('dnd.character', [])
	.factory('Character', Character)


/** @ngInject */
function Character($http) {

	var data;

	return {
		data: data,
		get: get,
		destroy: destroy,
		update: update,
	};

	function get(key) {
		return $http.get(`/api/v1/character/${key}`).then(function(response) {
            data = response.data.character;
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