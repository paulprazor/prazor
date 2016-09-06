var app = angular.module('app', [
    'ngRoute', 'ngTouch', 'angular-carousel', 'ngSanitize'
]);

app.config(['$routeProvider', '$httpProvider', function($routeProvider, $httpProvider) {
    $routeProvider
    // Home
        .when("/", {
            templateUrl: "http://prazor.com/app/scripts/source/modules/genres/views/genres.html",
            controller: 'GenreController'
        })
        // Pages
        .when("/music/genres", {
            templateUrl: "http://prazor.com/app/scripts/source/modules/genres/views/genres.html",
            controller: 'GenreController'
        })
        .when("/music/station/:stationId", {
            templateUrl: "http://prazor.com/app/scripts/source/modules/stations/views/stations.html",
            controller: 'StationController'
        })
        .when("/music/audioplayer", {
            templateUrl: "http://prazor.com/app/scripts/source/modules/stations/views/station-player-view.html",
            controller: 'StationController'
        })
        .when("/teaching", {
            templateUrl: "http://prazor.com/app/scripts/source/templates/categories.html",
            controller: 'TeachingCategoriesController'
        })
        .when("/teaching/teaching", {
            templateUrl: "http://prazor.com/app/scripts/source/templates/subCategory.html",
            controller: 'TeachingController'
        })
        .when("/teaching/playlist", {
            templateUrl: "http://prazor.com/app/scripts/source/templates/playlist.html",
            controller: 'PlaylistController'
        })
        .when("/teaching/video", {
            templateUrl: "http://prazor.com/app/scripts/source/templates/video.html",
            controller: 'VideoController'
        })
        .when("/talk", {
            templateUrl: "http://prazor.com/app/scripts/source/templates/categories.html",
            controller: 'TalkCategoriesController'
        })
        .when("/talk/talk", {
            templateUrl: "http://prazor.com/app/scripts/source/templates/subCategory.html",
            controller: 'TalkController'
        })
        .when("/talk/playlist", {
            templateUrl: "http://prazor.com/app/scripts/source/templates/playlist.html",
            controller: 'PlaylistController'
        })
        .when("/talk/video", {
            templateUrl: "http://prazor.com/app/scripts/source/templates/video.html",
            controller: 'VideoController'
        })
        // else 404
        .when("/404", {
            templateUrl: "http://prazor.com/app/scripts/source/modules/pageError/views/404.html",
            controller: 'PageErrorController'
        })
        .otherwise({
            redirectTo: '/404'
        });
}]);


app.initialize = function() {
    this.bindEvents();
};

app.bindEvents = function() {
    document.addEventListener('deviceready', this.onDeviceReady, true);
};

app.onDeviceReady = function() {
    angular.element(document).ready(function() {
        angular.bootstrap(document);
    });

    window.analytics.startTrackerWithId('UA-73794751-1');
};