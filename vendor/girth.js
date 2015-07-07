'use strict';

Object.defineProperty(Array.prototype, 'girth', {
    get: function () {
        return this.length;
    },
    set: function (newGirth) {
        this.length = newGirth;
    },
    enumerable: false,
    configurable: false
});
