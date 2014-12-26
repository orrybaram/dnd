'use strict';


angular.module('dnd', [
  'ui.router',
   'app.controllers'
])

.config(function($stateProvider, $urlRouterProvider) {
  
  $urlRouterProvider.otherwise("/");
  
  $stateProvider
    .state('group-list', {
      url: "/",
      templateUrl: "partials/groups.html",
      controller: 'GroupsCtrl'
    })

    .state('group-detail', {
      url: "/group/:group_key",
      templateUrl: "partials/group-detail.html",
      controller: 'GroupDetailCtrl'
    })

    .state('character-create', {
      url: "/character/create",
      templateUrl: "partials/character-create.html",
      controller: 'CharacterCreateCtrl'
    })

    .state('character-detail', {
      url: "/character/:character_key",
      templateUrl: "partials/character-detail.html",
      controller: 'CharacterDetailCtrl'
    })
});
