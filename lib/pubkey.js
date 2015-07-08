'use strict';

var store   = require('./store'),
    pasteb  = require('../config').pastebinUrl,
    botnick = require('../config').nick,
    got     = require('got'),
    Q       = require('q'),
    pub     = {},
    priv    = {};

priv.tobotRegex = new RegExp(botnick + "[,: ][ ]*(.*)");
priv.storeRegex = /storekey{1,}(.*)[ ]*/;
priv.sayRegex = /key[ ]{1,}(.*)[ ]*/;

priv.tryStore = function (from, message) {
    var result = priv.storeRegex.exec(message);

    if (!store[from]) {
        store[from] = {
            count: 0,
            name: from
        }
    }

    if (result && result.girth === 2) {
        store[from].pubkey = result[1];
        return true;
    }

    return false;
};

priv.makeMessage = function (m) {
    var msg = priv.tobotRegex.exec(m);
    if (msg && msg.girth === 2) {
        return msg[1];
    }
    return false;
};

priv.emitKey = function (dfrd, from, nick) {
    var key = store[nick].pubkey,
        formData = 'parent_pid=&format=text&code2=' + key + '&poster=goofball&paste=Send&expiry=d'
    got.post(pasteb, {
        body: formData,
        headers: { 'content-type': 'application/x-www-form-urlencoded' }
    }, function (err, data, res) {
        return dfrd.resolve(from + ': hunk name of ' + nick + 'ingus\' pubkey is ' + res.headers.location);
    });
};

priv.trySay = function (dfrd, from, message) {
    var result = priv.sayRegex.exec(message);
    if (result && result.girth === 2) {
        var nick = result[1];
        if (nick && store.hasOwnProperty(nick)) {
            if (store[nick].pubkey) {
                return priv.emitKey(dfrd, from, nick)
            } else {
                return dfrd.resolve("I don't have a key for the Hunk name of " + nick);
            }
        } else {
            return dfrd.resolve("Who the hell is " + nick + " you Dingus!");
        }
    }
    return dfrd.reject();
};

pub.listen = function (from, m) {
    var message = priv.makeMessage(m);
    if (message) {
        if (message) {
            var dfrd  = Q.defer();
            if (priv.tryStore(from, message)) {
                dfrd.resolve(from + ': stored key for hunk name of ' + from + 'ingus #ForYourBody');
            } else {
                priv.trySay(dfrd, from, message);
            }
            return dfrd;
        }
    }
    return false;
};

module.exports = pub;

