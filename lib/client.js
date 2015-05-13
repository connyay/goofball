'use strict';

var irc = require('irc');
var config = require('../config');

var client = new irc.Client(config.server, config.nick, {
    channels: config.channels,
});

module.exports = client;
