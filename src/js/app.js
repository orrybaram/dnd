'use strict';


angular.module('dnd', [
    'ui.router',
    'app.controllers',
    'directives',
    'ui.bootstrap',
    'angular.filter',
    'app.filters'
])

.config(function($stateProvider, $urlRouterProvider, $locationProvider) {
    
    $urlRouterProvider.otherwise("/");

    $stateProvider
        .state('group-list', {
            url: "/",
            templateUrl: "/partials/groups.html",
            controller: 'GroupsCtrl'
        })

    .state('group-detail', {
        url: "/group/:group_key",
        templateUrl: "/partials/group-detail.html",
        controller: 'GroupDetailCtrl'
    })

    .state('group-detail.dashboard', {
        url: "/dashboard",
        templateUrl: "/partials/group-detail.dashboard.html",
        controller: 'GroupDetailDashboardCtrl'
    })

    .state('group-detail.encounter', {
        url: "/encounter",
        templateUrl: "/partials/group-detail.encounter.html",
        controller: 'GroupDetailEncounterCtrl'
    })

    .state('character-detail', {
        url: "/character/:character_key",
        templateUrl: "/partials/character-detail.html",
        controller: 'CharacterDetailCtrl'
    })
})
.run(function($rootScope) {
    $rootScope.template_values = template_values;

    if(template_values.channel_token) {
        var channel = new goog.appengine.Channel(template_values.channel_token);
        var socket = channel.open();
        socket.onopen = function(){};
        socket.onmessage = function(data) {
            var message = JSON.parse(data.data);

            $rootScope.$broadcast('character-updated', {character: message.character})
            
        };
        socket.onerror = function(){};
        socket.onclose = function(){};    
    }
})
