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
      when('/search', {
        templateUrl: 'search.html',
        controller: 'searchController'
      }).
      when('/login', {
        templateUrl: 'login.html',
        controller: 'loginController'
      }).
      when('/room/:room', {
        templateUrl: 'room.html',
        controller: 'roomController'
      }).
      otherwise({
        redirectTo: '/login'
      });
  }]);
})();
