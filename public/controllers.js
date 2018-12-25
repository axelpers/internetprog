var fdbControllers = angular.module('fdbControllers', []);

fdbControllers.controller('loginController', ['$scope', 'HttpService', '$location', 'UserService',
  function($scope, http, $location, user) {
    $scope.username = "";
    $scope.password = "";
    $scope.login = function() {
      http.post('login', {newAccount: "False", username: $scope.username, password: $scope.password}, function(response) {
        if (response === "Success"){
          console.log('Rätt lösen och user');
          //$cookies.put('cookie', $scope.username);
          Cookies.set("UserCookie", $scope.username, {expires : 7});
          $location.path('home');
        } else {
          document.getElementById("loginFailed").style = "visibility:visible";
          document.getElementById("accountCreatedConfirmation").style = "visibility:hidden";
          document.getElementById("notifyNoDetails").style = "visibility:hidden";
          $location.path('login');
        }          
      })
    };
    $scope.createAccount = function(){
      //skicka details till servern
      http.post('login', {newAccount: "True", username: $scope.username, password: $scope.password}, function(response){
        //agera på response ---> här ska vi setta cookies och skicka till home 
        if (response === "Success"){
          console.log("User was created, rerouting to login");
          $location.path('login');
          document.getElementById("accountCreatedConfirmation").style = "visibility:visible";
          document.getElementById("notifyNoDetails").style = "visibility:hidden";
          document.getElementById("loginFailed").style = "visibility:hidden";
          //displaya att user har creatats
        } else if (response === "noDetails"){
          document.getElementById("notifyNoDetails").style = "visibility:visible";
        } else {
          console.log("nånting gick fel")
        }
      })
    };
  }
]);

fdbControllers.controller('homeController', ['$scope', 'HttpService', '$location', 'UserService',
  function($scope, http, $location, user) {
    http.post('home', {username: Cookies.get("UserCookie")}, function(res){
      //härifrån vill vi möjliggöra HTML-useage av a) movieWatchList, b) movietoprated och, c) searchableMovies
      $scope.searchableMovies = res.searchableMovies;
      $scope.watchlist = res.watchlist;
      $scope.topratedlist = res.topratedlist;

      $scope.username = Cookies.get("UserCookie");
    })

    $scope.search = function(){
      //här vill vi komma till en movie-sida
      //console.log($scope.searchword);
      var exists = true;
      if (exists === true){
          // reroute to moviepage
          $location.path('movies/'+$scope.searchword);
      } else if (data.response === "unavaliable"){
          // communicate unavaliability
          document.getElementById("notAvaliable").style = "visibility:visible";
        }
      }
    }
]);


fdbControllers.controller('movieController', ['$scope', 'HttpService', '$routeParams', '$route',
  function($scope, http, $routeParams, $route) {
    $scope.movieName = $routeParams.movie;
    console.log($routeParams.movie);
    http.get('movies/'+$scope.movieName, function(data) {
      console.log(data);
      $scope.movieObject = data;
    })
  }
]);


/////////

fdbControllers.controller('navigationController', ['$scope',  '$location',
  function($scope,  $location) {
    $scope.location = $location.path();

    // // This function should direct the user to the wanted page
    $scope.redirect = function(address) {
      $location.hash("");
      $location.path('/' + address);
      $scope.location = $location.path();
      //console.log("location = " + $scope.location);
    };

  }
]);

