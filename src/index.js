const _ = require("lodash");

require("angular");
require("angular-ui-router");
require("angular-ui-bootstrap");
require("angular-marked");

require("components/cards/power-card");
require("components/cards/feat-card");
require("components/cards/stat-card");
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
        'directives.featCard',
        'directives.statCard',
        'ui.bootstrap',
        'angular.filter',
        'app.filters',
        'hc.marked'
    ])
    .config(config)
    .run(onRun)

    .controller('AdminCtrl', require("components/admin"))
    .controller('AdminFeatsCtrl', require("components/admin/feats"))
    .controller('AdminItemsCtrl', require("components/admin/items"))

    .controller('GroupsCtrl', require("components/group-list"))
    .controller('GroupDetailCtrl', require("components/group-detail"))
    .controller('GroupDetailDashboardCtrl', require("components/group-detail/dashboard"))
    .controller('GroupDetailEncounterCtrl', require("components/group-detail/encounter"))
    .controller('GroupDetailStoryCtrl', require("components/group-detail/story"))
    .controller('GroupDetailAdminCtrl', require("components/group-detail/admin"))
    
    .controller('CharacterDetailCtrl', require("components/character-detail"))
    .controller('CharacterDetailAdvancedCtrl', require("components/character-detail/advanced"))
    .controller('CharacterDetailCombatCtrl', require("components/character-detail/combat"))
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

            .state('admin.feats', {
                url: "/feats",
                templateUrl: "/components/admin/feats/index.html",
                controller: 'AdminFeatsCtrl'
            })

            .state('admin.items', {
                url: "/items",
                templateUrl: "/components/admin/items/index.html",
                controller: 'AdminItemsCtrl'
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
            .state('character-detail.combat', {
                url: "/combat",
                templateUrl: "/components/character-detail/combat.html",
                controller: 'CharacterDetailCombatCtrl'
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


