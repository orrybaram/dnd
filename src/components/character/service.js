const {XP_LEVELS} = require("data/dnd-data");

angular.module('dnd.character', [])
	.factory('Character', Character)


/** @ngInject */
function Character($rootScope, $http) {

	var data = {};

	return {
		data: data,
		get: get,
		fetch: fetch,
		destroy: destroy,
		update: update,
		
		getAbilModifier: getAbilModifier,
	    getInitiativeTotal: getInitiativeTotal,
	    getHalfLevel: getHalfLevel,
	    roundDown: roundDown,
	    getBloodied: getBloodied,
	    getTotalAbilityScore: getTotalAbilityScore,
	    getDefenseTotal: getDefenseTotal,
	    getLevel: getLevel,
    	getSpeed: getSpeed,
    	getSkillTotal: getSkillTotal,
    
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

	function getAbilModifier(score) {
        return Math.floor((score - 10) / 2);
    }

    function getHalfLevel() {
        return Math.floor(data.level / 2);
    }

    function roundDown(score) {
        return Math.floor(score);
    }

    function getBloodied(hp) {
        var bloodied = roundDown(hp / 2);
        data.hp_bloodied = bloodied;
        return bloodied;
	}

    function getInitiativeTotal() {
        var total = parseInt(getAbilModifier(data.dexterity));
        total += parseInt(getHalfLevel());
        total += parseInt(data.initiative_misc);
        data.initiative_score = total;
        return total;
    }

    function getTotalAbilityScore(ability) {
        return parseInt(data[ability]) + parseInt(data[ability + '_misc_mod']);
    }

    function getDefenseTotal(defense) {
        var total = 10 + parseInt(getHalfLevel());

        total += parseInt(data[defense + '_abil']);
        total += parseInt(data[defense + '_char_class']);
        total += parseInt(data[defense + '_feat']);
        total += parseInt(data[defense + '_enh']);
        total += parseInt(data[defense + '_misc1']);
        total += parseInt(data[defense + '_misc2']);

        data[defense + '_total'] = total;

        return total;
    }

    function getLevel() {
        var level = 0;
		for (var i = 0; i < XP_LEVELS.length; i++) {
            if(XP_LEVELS[i] <= data.total_xp) {
                level += 1;
            }
        }
		data.level = level;
		return level;
    }

    function getSpeed() {
        var speed = parseInt(data.speed_base);
        speed += parseInt(data.speed_armor);
        speed += parseInt(data.speed_item);
        speed += parseInt(data.speed_misc);
        data.speed_total = speed;
        return speed;
    }

    function getSkillTotal(skill, ability) {
        var total = 0;

        if(data[skill + '_armor_penalty']) {
            total += parseInt(data[skill + '_armor_penalty']);
        }
        if(data[skill + '_trained']) {
            total += 5;
        }
        total += getAbilModifier(data[ability]) + getHalfLevel();
        total += parseInt(data[skill + '_misc']);
        data[skill + '_total'] = total;
        return total;
    }
}