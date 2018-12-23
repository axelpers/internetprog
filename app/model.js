/* jslint node: true */
"use strict";

var Sequelize = require('sequelize');
var db = new Sequelize('project', 'root', 'root',{
  host: 'localhost',
  port: '3306',
  dialect: 'mysql',
  logging: false
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

exports.checkLogin = function(username, callback){
  db.query("SELECT username FROM users WHERE username = :username", // nu är det case sensitive, det kanske vi kan ordna (setta alla till lowercase i DB och lowercasea all input)
  {replacements: { username: username}, type: db.QueryTypes.SELECT })
  .then(user => {
    if(user[0].username === username){
      db.query("SELECT password FROM users WHERE username = :username",
        {replacements: { username: username}, type: db.QueryTypes.SELECT })
        .then(data =>{
          callback(data);
        });
      } else {
        callback('User not found');
      }
    });
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

/**
 * Task.create({ title: 'foo', description: 'bar', deadline: new Date() }).then(task => {
  // you can now access the newly created task via the variable task
})
 */

exports.createTables = function (){
  // Create movie table
  var Movies = db.define('movies', {
    title: {type: Sequelize.STRING},
    genre: {type: Sequelize.STRING},
    year: {type: Sequelize.INTEGER},
    streamedBy: {type: Sequelize.STRING}
  });
  // Fill movie table
  // force: true will drop the table if it already exists
  Movies.sync({force: true}).then(() => {
    return Movies.bulkCreate([
      {title: 'Nightcrawler', genre: 'Thriller', year: '2014',streamedBy: 'Netflix'},
      {title: 'Kung Fu Panda', genre: 'Barn', year: '2008',streamedBy: 'CMORE'},
      {title: 'Wall Street', genre: 'Drama', year: '1987',streamedBy: 'None'},
      {title: 'The Town', genre: 'Crime', year: '2010',streamedBy: 'Netflix'},
      {title: 'Trettioåriga kriget', genre: 'Historia', year: '2018',streamedBy: 'SVT Play'},
      {title: 'They Shall Not Grow Old', genre: 'Historia', year: '2018',streamedBy: 'None'}
    ]);
  });
  // Create user table
  var Users = db.define('users', {
    username: {type: Sequelize.STRING},
    password: {type: Sequelize.STRING},
    email: {type: Sequelize.STRING}
  });
  // force: true will drop the table if it already exists
  Users.sync({force: true}).then(() => {
    // Table created
    return Users.bulkCreate([
      {username: 'Axel', password: 'password', email: 'axel@mail.com'},
      {username: 'Viktor', password: 'viktor94', email: 'viktor@mail.com'}
    ]);
  });
  // Create rating table
  var Rating = db.define('ratings', {
    username: {type: Sequelize.STRING},
    title: {type: Sequelize.STRING},
    rating: {type: Sequelize.INTEGER}
  });
  // force: true will drop the table if it already exists
  Rating.sync({force: true}).then(() => {
    // Table created
    return Rating.bulkCreate([
      {username: 'Axel', title: 'Nightcrawler', rating: '7'},
      {username: 'Viktor', title: 'Wall Street', rating: '10'}
    ]);
  });
  // Create watchlist table
  var Watchlist = db.define('watchlists', {
    username: {type: Sequelize.STRING},
    title: {type: Sequelize.STRING}
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



