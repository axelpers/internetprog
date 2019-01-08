/* jslint node: true */
"use strict";

var model = require('./model.js');

module.exports = function (socket, io) {

  // user joins room
  socket.on('join', function (req) {
    socket.join(req.securityName);
    console.log('A user joined '+req.securityName+"-tradingroom");
  });

  // user gets updated
  socket.on('updateWatchlist', function (req) {
    model.updateWatchlist(req.inWatchlist, req.user, req.movie);
  });

  socket.on('updateRating', function (req) {
    model.addNewRating(req.user, req.movie, req.rating);

    io.to(req.movie).emit('updateRating', {averagerating: 5});
    console.log('New rating (',req.rating,') added for',req.movie);
  });

  // user leaves room
  socket.on('leave', function (req) {
    var name = req.name;
    var user = req.user;
    var room = model.findRoom(name);

    console.log('A user left ' + name);
    io.to(name).emit('leave', user);
  });

};
