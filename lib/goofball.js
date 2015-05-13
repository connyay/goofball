'use strict';

var client = require('./client');
var goofs = require('./store');
var response = require('./responses.pm');

function markAndNotify(room, target, direction) {
    if (!goofs[target]) {
        goofs[target] = {
            name: target,
            count: 0
        };
    }
    if (direction === '++') {
        goofs[target].count++;
    } else if (direction === '--') {
        goofs[target].count--;
    }
    var count = goofs[target].count;
    var message = target + ' now has ' + count + ' goof';
    if (count !== 1) {
        message += 's';
    }
    client.say(room, message);
}

function randomPmResponse(to) {
    client.say(to, response.random());
}

var goofRegex = /goofs\.(.[\S]*)(\+\+|\-\-)/g;
client.addListener('message', function (from, to, message) {
    var result;
    while (result = goofRegex.exec(message)) { // jshint ignore:line
        markAndNotify(to, result[1], result[2]);
    }
    console.log(from + ' => ' + to + ': ' + message);
});

client.addListener('pm', function (from, message) {
    console.log(from + ' => ME: ' + message);
    setTimeout(randomPmResponse, 250, from);
});
