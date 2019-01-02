(function(){
  var app = angular.module("FDB", [
  'ngRoute',
  'fdbControllers',
  'ui.bootstrap'
  ]);

  app.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/list', {
        templateUrl: 'list.html',
        controller: 'listController'
      }).
      when('/home', {
        templateUrl: 'home.html',
        controller: 'homeController'
      }).
      when('/login', {
        templateUrl: 'login.html',
        controller: 'loginController'
      }).
      when('/movies/:movie', {
        templateUrl: 'movie.html',
        controller: 'movieController'
      }).
      otherwise({
        redirectTo: '/home'
      });
  }]);
})();
