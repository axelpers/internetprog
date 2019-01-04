var fdbControllers = angular.module('fdbControllers', []);


fdbControllers.controller('loginController', ['$scope', 'HttpService', '$location', 'UserService',
  function($scope, http, $location, user) {
    $scope.username = "";
    $scope.password = "";
    $scope.login = function() {     
      if (($scope.username === "")||($scope.password === "")){
        document.getElementById("messageBox").innerHTML = "Please enter details to log into your account!";
      } else { 
        http.post('login', {newAccount: "False", username: $scope.username, password: $scope.password}, function(response) {
          if (response.status === "Accepted"){
            // om Login OK: Setta cookies
            Cookies.set("UserCookie", response.username, {expires : 1});
            Cookies.set("loginStatus", "logged in", {expires : 1});
            $location.path('home');
          } else if (response.status === "Declined"){
            document.getElementById("messageBox").innerHTML = "Wrong username or password.";
            $location.path('login');
          }          
        })
      }
    };
    $scope.createAccount = function(){
      if (($scope.username === "")||($scope.password === "")){
        document.getElementById("messageBox").innerHTML = "Please enter details to create your account!";
      } else {
        http.post('login', {newAccount: "True", username: $scope.username, password: $scope.password}, function(response){
          //agera på response ---> här ska vi setta cookies och skicka till home 
          if (response === "Success"){
            console.log("User was created, rerouting to login");
            document.getElementById("messageBox").innerHTML = "Account succesfully created!";
            $location.path('login');
            //displaya att user har creatats
          } else if (response === "Declined") {
            console.log("Username already taken");
            document.getElementById("messageBox").innerHTML = "Username '"+$scope.username+"' is already taken";
          } else {
            console.log("nånting gick fel")
          }
        })
      }
    };
  }
]);

fdbControllers.controller('homeController', ['$scope', 'HttpService', '$location', 'UserService',
  function($scope, http, $location, user) {
    if ((Cookies.get("loginStatus") === "logged out") || (Cookies.get("loginStatus") === undefined)){
      $location.path('login')
    } else if (Cookies.get("loginStatus") === "logged in"){
      http.post('home', {username: Cookies.get("UserCookie")}, function(res){
        //härifrån vill vi möjliggöra HTML-useage av a) movieWatchList, b) movietoprated och, c) searchableMovies
        $scope.searchableMovies = res.searchableMovies;
        $scope.watchlist = res.watchlist;
        $scope.topratedlist = res.topratedlist;
        $scope.username = Cookies.get("UserCookie");
      })
      $scope.complete = function(searchword){  
        $scope.hidethis = false;  
        var output = [];
        var maxCounter = 0;
        angular.forEach($scope.searchableMovies, function(movieTitle){ 
          if (searchword.length !== 0){
            if (maxCounter < 10){
              if(movieTitle.toLowerCase().indexOf(searchword.toLowerCase()) >= 0){  
                output.push(movieTitle);  
                maxCounter++;
              }
            }
          }  
        });  
        $scope.filterMovie = output;  
      }  
      $scope.redirectToMovie = function(searchword){  
        $location.path('movies/'+searchword)
      }        

    } else {
      $location.path('login');
    }
  }
]);


fdbControllers.controller('movieController', ['$scope', 'HttpService', '$routeParams', '$location',
  function($scope, http, $routeParams, $location) {
    if ((Cookies.get("loginStatus") === "logged out") || (Cookies.get("loginStatus") === undefined)){
      $location.path('login')

    } else if (Cookies.get("loginStatus") === "logged in"){
      $scope.movieName = $routeParams.movie;
      http.get('movies/'+$scope.movieName, function(res) {
        console.log(res);
        $scope.movieObject = res.movieObject;
        $scope.averageRating = res.averageRating;
      })

    } else{
      $location.path('login');
    }
  }
]);


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

fdbControllers.controller('navigationController', ['$scope',  '$location',
  function($scope,  $location) {
    $scope.location = $location.path();

    // // This function should direct the user to the wanted page
    $scope.redirect = function(address) {
      $location.hash("");
      $location.path('/' + address);
      $scope.location = $location.path();
    };

    $scope.logout = function(){
      Cookies.set("loginStatus", "logged out");
      $location.path('login');

    }

  }
]);





