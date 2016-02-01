angular
    .module('dnd', [
        'ui.router',
        'app.controllers',
        'dnd.data',
        'dnd.modals',
        'dnd.character',
        'directives',
        'directives.powerCard',
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
            templateUrl: "/components/group-list/index.html",
            controller: 'GroupsCtrl'
        })

        .state('group-detail', {
            url: "/group/:group_key",
            templateUrl: "/components/group-detail/index.html",
            controller: 'GroupDetailCtrl'
        })

        .state('group-detail.dashboard', {
            url: "/dashboard",
            templateUrl: "/components/group-detail/dashboard.html",
            controller: 'GroupDetailDashboardCtrl'
        })

        .state('group-detail.encounter', {
            url: "/encounter",
            templateUrl: "/components/group-detail/encounter.html",
            controller: 'GroupDetailEncounterCtrl'
        })

        .state('group-detail.story', {
            url: "/story",
            templateUrl: "/components/group-detail/story.html",
            controller: 'GroupDetailStoryCtrl'
        })

        .state('group-detail.admin', {
            url: "/admin",
            templateUrl: "/components/group-detail/admin.html",
            controller: 'GroupDetailAdminCtrl'
        })

        .state('character-detail', {
            url: "/character/:character_key",
            templateUrl: "/components/character-detail/index.html",
            controller: 'CharacterDetailCtrl'
        })

        .state('character-detail.advanced', {
            url: "/advanced",
            templateUrl: "/components/character-detail/advanced.html",
            controller: 'CharacterDetailAdvancedCtrl as detail'
        })
        .state('character-detail.simple', {
            url: "/simple",
            templateUrl: "/components/character-detail/simple.html",
            controller: 'CharacterDetailSimpleCtrl'
        })
        .state('character-detail.powers', {
            url: "/powers",
            templateUrl: "/components/character-detail/powers.html",
            controller: 'CharacterDetailPowersCtrl as detail'
        })
        .state('character-detail.notes', {
            url: "/notes",
            templateUrl: "/components/character-detail/notes.html",
            controller: 'CharacterDetailNotesCtrl as detail'
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

