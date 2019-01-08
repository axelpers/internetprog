var fdbControllers = angular.module('fdbControllers', []);

// Controller som används på login-sidan
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
          }})}};
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
          }});
      }}}]);

// Controller som styr home-webbsidan
fdbControllers.controller('homeController', ['$scope', 'HttpService', '$location', 'UserService',
  function($scope, http, $location, user) {
    if ((Cookies.get("loginStatus") === "logged out") || (Cookies.get("loginStatus") === undefined)){
      $location.path('login')
    } else if (Cookies.get("loginStatus") === "logged in"){
      http.post('home', {username: Cookies.get("UserCookie")}, function(res){
        //härifrån  möjliggör vi HTML-useage
        $scope.searchableMovies = res.searchableMovies;
        $scope.watchlist = res.watchlist;
        $scope.topratedlist = res.topratedlist;
        $scope.username = Cookies.get("UserCookie");
      });

      //Funktion som möjliggör att dropdown föreslår filmer baserat på vad
      //användaren fyller i
      $scope.filterFunction = function(searchword){  
        var output = [];
        var maxCounter = 0; // Max tio i dropdown list
        // För varje filmtitel som det går att söka på körs denna
        // Lägger till i listan output som blir dropdown-listan
        angular.forEach($scope.searchableMovies, function(movieTitle){ 
          if (searchword.length !== 0){
            if (maxCounter < 10){
              if(movieTitle.toLowerCase().indexOf(searchword.toLowerCase()) >= 0){  
                output.push(movieTitle);  
                maxCounter++;
              }}}});  
        $scope.filterMovie = output;
      }  
      $scope.redirectToMovie = function(searchword){
        $location.path('movies/'+searchword);
      } 
    // Om man inte är inloggad (har rätt cookies) ska man kickas ut till loginsidan  
    } else {
      $location.path('login');
    }}]);

fdbControllers.controller('movieController', ['$scope', 'HttpService', '$routeParams', '$location',
  function($scope, http, $routeParams, $location) {
    if ((Cookies.get("loginStatus") === "logged out") || (Cookies.get("loginStatus") === undefined)){
      $location.path('login')

    } else if (Cookies.get("loginStatus") === "logged in"){
      // Skapar socket
      var socket = io().connect();
      $scope.movieName = $routeParams.movie;
      $scope.user = $routeParams.username;
      var ratinglist = [1,2,3,4,5,6,7,8,9,10];
      $scope.ratings = ratinglist;

      http.get('movies/'+$scope.movieName, function(res) {
        $scope.movieObject = res.movieObject;
        $scope.averageRating = res.averageRating;
        $scope.inWatchlist = res.inWatchlist;

        // Funktion för att fylla ut stjärnorna baserat på rating
        $scope.getStars = function(rating) {
          var val = parseFloat(rating);
          var size = val/10*100;
          return size + '%';
        }
        // Lägga till att användaren joinar filmrummet
        socket.emit("join", {movieRoom: $scope.movieName});
      });

      $scope.updateWatchlist = function() {
        socket.emit("updateWatchlist", {inWatchlist:$scope.inWatchlist, user:Cookies.get('UserCookie'), movie:$scope.movieName});
        if($scope.inWatchlist ==='Add to watchlist' ){
          $scope.inWatchlist = 'Remove from watchlist';
        } else if($scope.inWatchlist ==='Remove from watchlist'){
          $scope.inWatchlist = 'Add to watchlist';
        }
      }
      $scope.updateRating = function() {
        if ($scope.selectedRating === undefined || $scope.selectedRating.length == 0) {
          document.getElementById("messageBox").innerHTML = "Please enter a valid rating before pressing the button!";
        } else {
          socket.emit("updateRating", {user:Cookies.get('UserCookie'), movie:$scope.movieName, rating:$scope.selectedRating});
        }
      }
      socket.on('updateRating', function (data) {
        $scope.$apply(function(){
          $scope.averageRating = data.averageRating;
        });
      });
    } else {
      $location.path('login');
    }}]);

// Controller som används för navigations-baren
fdbControllers.controller('indexController', ['$scope',  '$location',
  function($scope,  $location) {
    $scope.location = $location.path();

    $scope.redirect = function(address) {
      $location.hash("");
      $location.path('/' + address);
      $scope.location = $location.path();
    };

    $scope.logout = function(){
      Cookies.set("loginStatus", "logged out");
      $location.path('login');
    }}]);