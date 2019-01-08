/* jslint node: true */
"use strict";

var model = require('./model.js');

module.exports = function (socket, io) {

  // Användare ska ansluta till filmrum
  socket.on('join', function (req) {
    socket.join(req.movieRoom);
  });

  // Updatera watchlist för en användare
  socket.on('updateWatchlist', function (req) {
    model.updateWatchlist(req.inWatchlist, req.user, req.movie);
  });

  // Uppdatera rating för en film och emitta ut det till alla användare
  // som just då är inne i det filmrummet
  socket.on('updateRating', function (req) {
    model.addNewRating(req.user, req.movie, req.rating, function(newAvgRating){
      io.to(req.movie).emit('updateRating', {averageRating: Math.round(newAvgRating[0].avg*10)/10})
    });
  });
};
