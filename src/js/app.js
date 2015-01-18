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

    .state('group-detail.story', {
        url: "/story",
        templateUrl: "/partials/group-detail.story.html",
        controller: 'GroupDetailStoryCtrl'
    })

    .state('group-detail.admin', {
        url: "/admin",
        templateUrl: "/partials/group-detail.admin.html",
        controller: 'GroupDetailAdminCtrl'
    })

    .state('character-detail', {
        url: "/character/:character_key",
        templateUrl: "/partials/character-detail.html",
        controller: 'CharacterDetailCtrl'
    })

    .state('character-detail.advanced', {
        url: "/advanced",
        templateUrl: "/partials/character-detail.advanced.html",
        controller: 'CharacterDetailAdvancedCtrl as detail'
    })
    .state('character-detail.simple', {
        url: "/simple",
        templateUrl: "/partials/character-detail.simple.html",
        controller: 'CharacterDetailSimpleCtrl'
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
