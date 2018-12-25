/* jslint node: true */
"use strict";

var express = require('express');
var router = express.Router();
var model = require("./model.js");


router.post('/login', function(req, res){
  if(req.body.newAccount === "True"){
    if ((req.body.username === "")||(req.body.password === "")){
      res.json("noDetails");
    } else {
      //ska ny user
      console.log("Skapar ny user.... Username: ", req.body.username, "och lösen: ", req.body.password);
      // ...write to DB
      res.json('Success')
    }
  } else if(req.body.newAccount === "False") {
    model.checkLogin(req.body.username, function(data){
      if (data != 'User not found'){
        var pw = data[0].password;
        if(pw.lenght === 0){
          res.json('Failed');
        } else if(pw === req.body.password){
          res.json('Success');
        } else {
          res.json('Failed');
        }
      } else {
        res.json('Failed');
      }
    })
  }
});

router.post('/home', function(req, res){
  model.fetchHomescreen(req.body.username, function(searchableMovies, watchlist, topratedlist){
    //console.log(searchableMovies);
    //console.log(watchlist);
    //console.log(topratedlist);
    res.json({searchableMovies: searchableMovies, watchlist: watchlist, topratedlist: topratedlist});
  })
})

router.get('/movies/:movie', function (req, res) {
  model.getMovieObject(req.params.movie, function(movieObject){
    res.json(movieObject)})
})

module.exports = router;