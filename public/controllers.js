var fdbControllers = angular.module('fdbControllers', []);



fdbControllers.controller('listController', ['$scope', '$location',  'HttpService',
  function($scope, $location, http) {

    $scope.rooms = [];
    http.get("/roomList", function(data) {
      $scope.rooms = data.list;
    });
    $scope.redirect = function(room) {
      console.log("Trying to enter room : " + room.name);
      $location.hash("");
      $location.path('/room/' + room.name);
    };
  }
]);

fdbControllers.controller('roomController', ['$scope', 'HttpService', '$routeParams', 'UserService',
  function($scope, http, $routeParams, user) {
    $scope.room = $routeParams.room;
    $scope.mess = "";
    $scope.entries = [];
    // $scope.entries = ["always", "leaving", "from", "recieve", "me", "down"];
    http.get("/room/"+$scope.room, function(data) {
      $scope.entries = data.list;
      socket.emit("join", {name:$scope.room, username: user.getName()});
    });
    var socket = io().connect();

    socket.on('update', function (data) {
      $scope.$apply(function(){
        console.log("update");
        console.log(data);
        $scope.entries.push(data.username + ": " + data.update);
      });
    });

    socket.on('join', function (data) {
      $scope.$apply(function(){
        console.log("join");
        console.log(data);
        $scope.entries.push(data.username + " joined the channel");
      });
    });

    $scope.redirect = function(room) {
      console.log("Trying to enter room : " + room.name);
      $location.hash("");
      $location.path('/room/' + room.name);
    };

    $scope.done = function() {
      console.log("Reached done()");
      socket.emit("update", {room:$scope.room, update:$scope.mess, username:user.getName()});
      $scope.mess = "";
    };

  }
]);


fdbControllers.controller('searchController', ['$scope',
  function($scope) {

  }
]);

fdbControllers.controller('loginController', ['$scope', 'HttpService', '$location', 'UserService',
  function($scope, http, $location, user) {
    $scope.username = "";
    $scope.password = "";
    $scope.done = function() {
      http.post('login', {username: $scope.username, password: $scope.password}, function(response) {
        if (response === "Success"){
          console.log('Rätt lösen och user');
          $location.path('search');
        } else {
          alert("Login failed you stupid!");
          console.log('FEEEEL lösen och user');
          $location.path('login');
        }          
      })
    };
  }
]);

fdbControllers.controller('navigationController', ['$scope',  '$location',
  function($scope,  $location) {
    $scope.location = $location.path();

    // // This function should direct the user to the wanted page
    $scope.redirect = function(address) {
      $location.hash("");
      $location.path('/' + address);
      $scope.location = $location.path();
      console.log("location = " + $scope.location);
    };

  }
]);
