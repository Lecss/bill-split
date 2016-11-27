'use strict';

/**
 * @ngdoc overview
 * @name billSplitApp
 * @description
 * # billSplitApp
 *
 * Main module of the application.
 */
angular
  .module('billSplitApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ngStorage'
  ])
  .config(function ($routeProvider, $touchProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
      })
      .otherwise({
        redirectTo: '/'
      });

      $touchProvider.ngClickOverrideEnabled(true);
  })

  .directive('imageonload', function() {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            element.bind('load', function() {
                element.addClass("loaded")

            });
            element.bind('error', function(){
               // alert('image could not be loaded');
            });
        }
    };
});