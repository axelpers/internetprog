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
  socket.on('update', function (req) {
    console.log(req.securityName);

    model.findSecurity(req.securityName).addOrder(req.securityName, req.securityID, req.orderType, req.volume, req.price);
    model.checkClearing(model.findSecurity(req.securityName));
    
    var tradeList = model.findSecurity(req.securityName).tradeList.sort(function(a,b){return a.tradeID - b.tradeID}).reverse();
    var sellOrderbook = model.getSellOrderbook(req.securityName);
    var buyOrderbook = model.getBuyOrderbook(req.securityName);
        
    io.to(req.securityName).emit('update', {sellOrderbook: sellOrderbook, buyOrderbook: buyOrderbook, tradeList: tradeList});
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
