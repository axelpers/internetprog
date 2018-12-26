/* jslint node: true */
"use strict";

var express = require('express');
var router = express.Router();
var model = require("./model.js");


router.post('/login', function(req, res){
  if(req.body.newAccount === "True"){
    model.createNewUser(req.body.username, req.body.password);
    res.json('Success')
  } else if (req.body.newAccount === "False") {
    model.checkLogin(req.body.username, req.body.password, function(status, username){
      res.json({status: status, username: username})
    })
  } else {
    console.log("trololol");
  }
});


router.post('/home', function(req, res){
  model.fetchHomescreen(req.body.username, function(searchableMovies, watchlist, topratedlist){
    res.json({searchableMovies: searchableMovies, watchlist: watchlist, topratedlist: topratedlist});
  })
})

router.get('/movies/:movie', function (req, res) {
  model.getMovieObject(req.params.movie, function(movieObject){
    res.json(movieObject)})
})

module.exports = router;