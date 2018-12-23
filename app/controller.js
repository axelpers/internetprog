/* jslint node: true */
"use strict";

var express = require('express');
var router = express.Router();
var model = require("./model.js");


router.post('/login', function(req, res){
  // We are using a callback function
  if(req.body.newAccount === "True"){
    //ska ny user
    console.log("Skapa ny user med Username: ", req.body.username, "och lösen: ", req.body.password);
    // ...write to DB
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
    console.log(searchableMovies);
    console.log(watchlist);
    console.log(topratedlist);
    res.json({searchableMovies: searchableMovies, watchlist: watchlist, topratedlist: topratedlist});
  })
})

module.exports = router;