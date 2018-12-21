/* jslint node: true */
"use strict";

var express = require('express');
var router = express.Router();
var model = require("./model.js");


router.post('/login', function(req, res){
  // We are using a callback function
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
});

router.post('/home', function(req, res){
  model.fetchWatchlist(req.body.username, function(data){
    console.log(data);
    res.json(data);
  });
})

module.exports = router;