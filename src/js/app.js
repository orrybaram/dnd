'use strict';


angular.module('dnd', [
  'ui.router',
   'app.controllers'
])

.config(function($stateProvider, $urlRouterProvider) {
  //
  // For any unmatched url, redirect to /state1
  $urlRouterProvider.otherwise("/character");
  //
  // Now set up the states
  $stateProvider
    .state('character', {
      url: "/character",
      templateUrl: "partials/character.html",
      controller: 'CharacterCtrl'
    })
});
