'use strict';

var config = require('../config');
var client = require('./client');
var goofs = require('./store');
var pubkey = require('./pubkey');
var response = require('./responses.pm');

function pluralizeGoof(count) {
    if (count === 1) {
        return 'goof';
    }
    return 'goofs';
}

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
    var message = target + ' now has ' + count + ' ' + pluralizeGoof(count);
    client.say(room, message);
}

function determineTopAndNotify(room) {
    var top = [];
    Object.keys(goofs).forEach(function (g) {
        top.push(goofs[g]);
    });
    top.sort(function (a, b) {
        if (a.count > b.count) {
            return -1;
        }
        if (a.count < b.count) {
            return 1;
        }
        return 0;
    });
    top = top.slice(0, 3);
    var message = 'Goof Leaderboard:\n';
    top.forEach(function (g, idx) {
        message += ((idx + 1) + ') ' + g.name + ' with ' + g.count + ' ' + pluralizeGoof(g.count) + '\n');
    });
    client.say(room, message);
}


function randomPmResponse(to) {
    client.say(to, response.random());
}

var goofRegex = /goofs\.([\+\-\w]{1,}?)(\-\-|\+\+|\s|$)/g;
var topRegex = new RegExp(config.nick + ' top');
var pmTopRegex = /(^top|\stop)/;

client.addListener('message', function (from, room, message) {
    console.log(from + ' => ' + room + ': ' + message);

    pubkey.listen(from, message).promise.then(function (data) {
        client.say(room, data);
    }).catch(function (data) {
        console.log('catch');
        console.log(data);
    });

    var result;
    while (result = goofRegex.exec(message)) { // jshint ignore:line
        var theGoofer = result[1];
        var direction = result[2];
        if (direction) {
            if (from === theGoofer && direction === '--') {
                client.say(room, 'Hey everyone! ' + theGoofer + ' tried to remove his/her own goof. Thats a goof.');
                direction = '++';
            }
            markAndNotify(room, theGoofer, direction);
        } else {
            var count = 0;
            if (goofs[theGoofer]) {
                count = goofs[theGoofer].count;
            }
            client.say(room, theGoofer + ' has ' + count + ' ' + pluralizeGoof(count));
        }
    }
    if (topRegex.test(message)) {
        determineTopAndNotify(room);
    }
});

client.addListener('pm', function (from, message) {
    console.log(from + ' => ME: ' + message);
    setTimeout(randomPmResponse, 250, from);
    if (topRegex.test(message) || pmTopRegex.test(message)) {
        determineTopAndNotify(from);
    }

});
