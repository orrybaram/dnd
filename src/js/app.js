'use strict';


angular.module('dnd', [
  'ui.router',
   'app.controllers'
])

.config(function($stateProvider, $urlRouterProvider) {
  //
  // For any unmatched url, redirect to /state1
  $urlRouterProvider.otherwise("/character/create");
  //
  // Now set up the states
  $stateProvider
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
