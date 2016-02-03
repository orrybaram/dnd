require("angular");
require("angular-ui-router");
require("angular-ui-bootstrap");

require("components/cards/power-card");
require("components/modals");
require("components/character/service");
require("./data");
require("./js/directives");
require("./js/ng-filters");


angular
    .module('dnd', [
        'ui.router',
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

    .controller('AdminCtrl', require("components/admin"))

    .controller('GroupsCtrl', require("components/group-list"))
    .controller('GroupDetailCtrl', require("components/group-detail"))
    .controller('GroupDetailDashboardCtrl', require("components/group-detail/dashboard"))
    .controller('GroupDetailEncounterCtrl', require("components/group-detail/encounter"))
    .controller('GroupDetailStoryCtrl', require("components/group-detail/story"))
    .controller('GroupDetailAdminCtrl', require("components/group-detail/admin"))
    .controller('CharacterDetailCtrl', require("components/character-detail"))
    .controller('CharacterDetailAdvancedCtrl', require("components/character-detail/advanced"))
    .controller('CharacterDetailSimpleCtrl', require("components/character-detail/simple"))
    .controller('CharacterDetailPowersCtrl', require("components/character-detail/powers"))
    .controller('CharacterDetailNotesCtrl', require("components/character-detail/notes"))
;

function config($stateProvider, $urlRouterProvider, $locationProvider) {
    $urlRouterProvider.otherwise("/");

    $stateProvider
        .state('admin', {
            url: "/admin",
            templateUrl: "/components/admin/index.html",
            controller: 'AdminCtrl'
        })

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


