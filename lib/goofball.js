'use strict';

var client = require('./client');
var goofs = require('./store');

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

var goofRegex = /goofs\.(.*)(\+\+|\-\-)/;

client.addListener('message', function (from, to, message) {
    var matches = goofRegex.exec(message);
    if (matches && matches.length === 3) {
        markAndNotify(to, matches[1], matches[2]);
    }
    console.log(from + ' => ' + to + ': ' + message);
});
