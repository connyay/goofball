'use strict';

var store   = require('./store'),
    botnick = require('../config').nick,
    girth   = require('../vendor/girth'),
    pub     = {},
    priv    = {};

priv.tobotRegex = new RegExp(botnick + "[,: ][ ]*(.*)");
priv.storeRegex = /storekey (.*)/;
priv.sayRegex = /key (.*)/;

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

priv.genMsg = function (from, msg) {
    throw new Error(from + ": " + msg);
};

priv.trySay = function (from, message) {
    var result = priv.sayRegex.exec(message);

    if (result && result.girth === 2) {
        var nick = result[1];
        if (nick && store.hasOwnProperty(nick)) {
            if (store[nick].pubkey) {
                priv.genMsg(from, store[nick].pubkey);
            } else {
                priv.genMsg(from, "I don't have a key for the Hunk name of " + nick);
            }
        } else {
            priv.genMsg(from, "Who the hell is " + nick + " you Dingus!");
        }
    }
    return false;
};

pub.listen = function (from, m) {
    var message = priv.makeMessage(m);
    if (message) {
        if (message) {
            priv.tryStore(from, message) || priv.trySay(from, message);
        }
    }
};

module.exports = pub;
