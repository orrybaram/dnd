module.exports = Feats;

/** @ngInject */
function Feats($http, $rootScope) {
	
	var feats = [];

	return {
		get: get,
		add: add,
		edit: edit,
		feats: feats,
		fetch: fetch,
		remove: remove,
		destroy: destroy,
		create_new: create_new
	};

	function get() {
		if(feats.length) {
			$rootScope.$broadcast('fetched-feats', feats);
		}
		fetch();
	}

	function fetch() {
		return $http.get('/api/v1/feats').then(function(response) {
			feats = response.data;
			$rootScope.$broadcast('fetched-feats', feats);
			return feats;
		});
	}

	function edit(feat) {
		return $http.post('/api/v1/feats', feat).then(function() {
			$rootScope.$broadcast('feat-editted');
		});
	}

	function add(data, character_key) {
		return $http.post('/api/v1/character/' + character_key + '/feats/add/', data);
    }

    function remove(feat_id, character_key) {
		return $http.post('/api/v1/character/' + character_key + '/feats/' + feat_id + '/delete/');
	}

	function destroy(feat_id) {
		return $http.post(`/api/v1/feats/${feat_id}/delete/`).then(function(data) {
			console.log(data);
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
			id: (feats.length + 2).toString(),
			name: feat.name,
			html: template
		};
		return $http.post('/api/v1/feats/', postData);
	}
}

