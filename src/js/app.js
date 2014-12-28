'use strict';


angular.module('dnd', [
    'ui.router',
    'app.controllers',
    'directives'
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

    .state('character-detail', {
        url: "/character/:character_key",
        templateUrl: "/partials/character-detail.html",
        controller: 'CharacterDetailCtrl'
    })


})
.run(function($rootScope) {
    $rootScope.template_values = template_values;
})
