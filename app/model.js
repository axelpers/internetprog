/* jslint node: true */
"use strict";

var Sequelize = require('sequelize');
var db = new Sequelize('project', 'root', 'root',{
  host: 'localhost',
  port: '3306',
  dialect: 'mysql',
  logging: false
});

// Create movie table
var Movies = db.define('movies', {
  title: {type: Sequelize.STRING},
  genre: {type: Sequelize.STRING},
  year: {type: Sequelize.INTEGER},
  streamedBy: {type: Sequelize.STRING},
  avg_rating: {type: Sequelize.DOUBLE},
  num_of_ratings: {type: Sequelize.INTEGER}
});
// Create user table
var Users = db.define('users', {
  username: {type: Sequelize.STRING},
  password: {type: Sequelize.STRING},
  email: {type: Sequelize.STRING}
});
// Create rating table
var Rating = db.define('ratings', {
  username: {type: Sequelize.STRING},
  title: {type: Sequelize.STRING},
  rating: {type: Sequelize.INTEGER}
});
// Create watchlist table
var Watchlist = db.define('watchlists', {
  username: {type: Sequelize.STRING},
  title: {type: Sequelize.STRING}
});



exports.checkDB = function (){
  db.authenticate()
    .then(() => {
      console.log('Connection has been established successfully. NICE!');
    })
    .catch(err => {
      console.error('Unable to connect to the database:', err);
    });
}

exports.printMovies = function(){
  db.query("SELECT * FROM Movies",
    {type: db.QueryTypes.SELECT}
  ).then(data =>{
    console.log(data);
  });
}

exports.checkLogin = function(usernameEntered, passwordEntered, callback){
  try{
    db.query("SELECT * FROM users WHERE password = :password",
      {replacements: { password: passwordEntered}, type: db.QueryTypes.SELECT })
      .then(data =>{
        var usernameDB = null;
        for (var i=0; i<data.length; i++){ //det skulle kunna vara så att flera accounts har samma PW
          if (data[i].username.toLowerCase() === usernameEntered.toLowerCase()){
             usernameDB = data[i].username;
          }
        }
        if (usernameDB !== null){
          callback("Accepted", usernameDB); //skicka också med det korrekta Usernamet (om man t.ex. skrivit viktor med litet v)
        } else {
          callback("Declined", null);
        }
      });
  } catch (e) {
    callback("Declined", null);
  }

}

exports.fetchHomescreen = function(username, callback){
  db.query("SELECT * FROM movies WHERE title IN (SELECT title FROM watchlists WHERE username = :username)",
  {replacements: { username: username}, type: db.QueryTypes.SELECT })
  .then(watchlist => {
    var watchlist = watchlist;
    
    db.query("SELECT title FROM movies",
    {type: db.QueryTypes.SELECT })
    .then(searchableMovies => {
      var searchableMovies = searchableMovies;

      db.query("SELECT title FROM ratings WHERE rating >6",
      {type: db.QueryTypes.SELECT })
      .then(topratedlist => {
        var topratedlist = topratedlist;
        callback(searchableMovies, watchlist, topratedlist);
      });
    });
  });
}

exports.getMovieObject = function(title, callback){
  // find the movieobject from DB
  db.query("SELECT * FROM MOVIES WHERE title = :title",
  {replacements: { title: title}, type: db.QueryTypes.SELECT})
  .then(movieObject => {
    var movieObject = movieObject[0];
    callback(movieObject);
  })
}

exports.addToWatchlist = function(user, movieTitle){
  var Watchlist = db.define('watchlists', {
    username: {type: Sequelize.STRING},
    title: {type: Sequelize.STRING}
  });
  Watchlist.create({ username: user, title: movieTitle});
}

exports.addRating = function(user, movieTitle, givenRating){
  var Rating = db.define('ratings', {
    username: {type: Sequelize.STRING},
    title: {type: Sequelize.STRING},
    rating: {type: Sequelize.INTEGER}
  });
  Rating.create({ username: user, title: movieTitle, rating: givenRating});
}

exports.createNewUser = function(chosenUsername, chosenPassword){
    Users.create({
      username: chosenUsername, 
      password: chosenPassword, 
      email: 'default@mail.com'
    });
}
     



exports.createTables = function (){
  // Fill movie table
  // force: true will drop the table if it already exists
  Movies.sync({force: true}).then(() => {
    return Movies.bulkCreate([
      {title: 'Nightcrawler', genre: 'Thriller', year: 2014, streamedBy: 'Netflix', avg_rating: 4.4, num_of_ratings: 18 },
      {title: 'Kung Fu Panda', genre: 'Barn', year: 2008, streamedBy: 'CMORE', avg_rating: 3.6, num_of_ratings: 30 },
      {title: 'Wall Street', genre: 'Drama', year: 1987, streamedBy: 'None', avg_rating: 4.7, num_of_ratings: 46 },
      {title: 'The Town', genre: 'Crime', year: 2010, streamedBy: 'Netflix', avg_rating: 4.0, num_of_ratings: 8 },
      {title: 'Trettioåriga kriget', genre: 'Historia', year: 2018, streamedBy: 'SVT Play', avg_rating: 3.2, num_of_ratings: 3 },
      {title: 'They Shall Not Grow Old', genre: 'Historia', year: 2018, streamedBy: 'None', avg_rating: 4.5, num_of_ratings: 22 }
    ]);
  });

  // force: true will drop the table if it already exists
  Users.sync({force: true}).then(() => {
    // Table created
    return Users.bulkCreate([
      {username: 'Axel', password: 'password', email: 'axel@mail.com'},
      {username: 'Viktor', password: 'viktor94', email: 'viktor@mail.com'}
    ]);
  });

  // force: true will drop the table if it already exists
  Rating.sync({force: true}).then(() => {
    // Table created
    return Rating.bulkCreate([
      {username: 'Axel', title: 'Nightcrawler', rating: '7'},
      {username: 'Viktor', title: 'Wall Street', rating: '10'}
    ]);
  });
  
  // force: true will drop the table if it already exists
  Watchlist.sync({force: true}).then(() => {
    // Table created
    return Watchlist.bulkCreate([
      {username: 'Axel', title: 'Trettioåriga kriget'},
      {username: 'Viktor', title: 'Nightcrawler'},
      {username: 'Axel', title: 'Wall Street'},
      {username: 'Axel', title: 'They Shall Not Grow Old'}
    ]);
  });
}



