angular
    .module('dnd', [
        'ui.router',
        'app.controllers',
        'directives',
        'ui.bootstrap',
        'angular.filter',
        'app.filters'
    ])
    .config(config)
    .run(onRun)
;

function config($stateProvider, $urlRouterProvider, $locationProvider) {
    $urlRouterProvider.otherwise("/");

    $stateProvider
        .state('group-list', {
            url: "/",
            templateUrl: "/components/group-list/groups.html",
            controller: 'GroupsCtrl'
        })

        .state('group-detail', {
            url: "/group/:group_key",
            templateUrl: "/components/group-detail/group-detail.html",
            controller: 'GroupDetailCtrl'
        })

        .state('group-detail.dashboard', {
            url: "/dashboard",
            templateUrl: "/components/group-detail/group-detail.dashboard.html",
            controller: 'GroupDetailDashboardCtrl'
        })

        .state('group-detail.encounter', {
            url: "/encounter",
            templateUrl: "/components/group-detail/group-detail.encounter.html",
            controller: 'GroupDetailEncounterCtrl'
        })

        .state('group-detail.story', {
            url: "/story",
            templateUrl: "/components/group-detail/group-detail.story.html",
            controller: 'GroupDetailStoryCtrl'
        })

        .state('group-detail.admin', {
            url: "/admin",
            templateUrl: "/components/group-detail/group-detail.admin.html",
            controller: 'GroupDetailAdminCtrl'
        })

        .state('character-detail', {
            url: "/character/:character_key",
            templateUrl: "/components/character-detail/character-detail.html",
            controller: 'CharacterDetailCtrl'
        })

        .state('character-detail.advanced', {
            url: "/advanced",
            templateUrl: "/components/character-detail/character-detail.advanced.html",
            controller: 'CharacterDetailAdvancedCtrl as detail'
        })
        .state('character-detail.simple', {
            url: "/simple",
            templateUrl: "/components/character-detail/character-detail.simple.html",
            controller: 'CharacterDetailSimpleCtrl'
        })
    ;
}

/** @ngInject */
function onRun($rootScope) {
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
}

