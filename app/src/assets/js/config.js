/* ============================================================
 * File: config.js
 * Configure routing
 * ============================================================ */

angular.module('app').config(['$stateProvider', '$urlRouterProvider', '$ocLazyLoadProvider', '$locationProvider', function($stateProvider, $urlRouterProvider, $ocLazyLoadProvider, $locationProvider) {
    
    $urlRouterProvider.otherwise('/login');

    $stateProvider
        .state('login', {
            url: "/login",
            templateUrl: "tpl/login.html",
            controller: 'LoginCtrl'
        })
        .state('app', {
            abstract: true,
            url: "/",
            templateUrl: "tpl/app.html"
        })
        .state('app.dashboard', {
            url: "home",
            templateUrl: "tpl/home.html",
            controller: 'HomeCtrl',
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([
                            /* 
                                Load any ocLazyLoad module here
                                ex: 'wysihtml5'
                                Open config.lazyload.js for available modules
                            */
                        ], {
                            insertBefore: '#lazyload_placeholder'
                        })
                        .then(function() {
                            return $ocLazyLoad.load([
                                'assets/js/controllers/home.js'
                            ]);
                        });
                }]
            }
        });
    $locationProvider.html5Mode(true);
}]);

angular.module('app').config(['$sceDelegateProvider', function($sceDelegateProvider) {
    $sceDelegateProvider.resourceUrlWhitelist([
        'self',
        'http://ignition-cats-back.herokuapp.com/api/v1/**'
    ]);
}]);

angular.module('app').config(['RestangularProvider', function(RestangularProvider) {
    RestangularProvider.setBaseUrl('http://ignition-cats-back.herokuapp.com/api/v1/');
}]);

angular.module('app').config(['localStorageServiceProvider', function (localStorageServiceProvider) {
    localStorageServiceProvider.setPrefix('ignition')
}]);

angular.module('app').config(['$translateProvider', '$translatePartialLoaderProvider', function ($translateProvider, $translatePartialLoaderProvider) {
    $translateProvider.useSanitizeValueStrategy('escape');
    $translatePartialLoaderProvider.addPart('translate');
    $translateProvider.useLoader('$translatePartialLoader', {
        urlTemplate: '{part}/lang_{lang}.json'
    });
}]);