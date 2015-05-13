'use strict';

var fs = require('fs');

// Temp store while I'm goofin' around
var store = {};
try {
    store = require('../.store');
} catch (e) {}

function exitHandler(options, err) {
    if (options.cleanup) {
        fs.writeFileSync('.store.json', JSON.stringify(store));
    }
    if (err) {
        console.log(err.stack);
    }
    if (options.exit) {
        process.exit();
    }
}
process.on('exit', exitHandler.bind(null, {
    cleanup: true
}));

process.on('SIGINT', exitHandler.bind(null, {
    exit: true
}));

process.on('SIGTERM', exitHandler.bind(null, {
    exit: true
}));


module.exports = store;
