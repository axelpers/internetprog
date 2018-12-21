var fdbControllers = angular.module('fdbControllers', []);

fdbControllers.controller('loginController', ['$scope', 'HttpService', '$location', 'UserService',
  function($scope, http, $location, user) {
    $scope.username = "";
    $scope.password = "";
    $scope.done = function() {
      http.post('login', {username: $scope.username, password: $scope.password}, function(response) {
        if (response === "Success"){
          console.log('Rätt lösen och user');
          //$cookies.put('cookie', $scope.username);
          $location.path('home');
        } else {
          alert("Login failed you stupid!");
          console.log('FEEEEL lösen och user');
          $location.path('login');
        }          
      })
    };
  }
]);

fdbControllers.controller('homeController', ['$scope', 'HttpService', '$location', 'UserService',
  function($scope, http, $location, user) {
    $scope.username = 'Axel';
    //console.log($cookies.get('cookie'));
    http.post('/home', {username: $scope.username}, function(data){
      // console.log('Hej');
      console.log(data);
    })
  }
]);









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
