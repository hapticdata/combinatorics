(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.combinatorics = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

/**
 * scale a value from one range of numbers to another
 * @param {Number} value
 * @param {Number} start1
 * @param {Number} stop1
 * @param {Number} start2
 * @param {Number} stop2
 * @returns {Number}
 */
function scalemap(value, start1, stop1, start2, stop2) {
    return start2 + (stop2 - start2) * ((value - start1) / (stop1 - start1));
}

//faster than Array.prototype.map.call(arguments, fn)
function map(arr, fn) {
    var result = [];
    for (var i = 0; i < arr.length; i++) {
        result[i] = fn(arr[i], i, arr);
    }

    return result;
}

function times(n, fn) {
    var result = [];
    for (var i = 0; i < n; i++) {
        result[i] = fn(i, n);
    }
    return result;
}

var zero = function zero() {
    return 0;
};

function min(arr) {
    var len = Number.MAX_VALUE,
        index = -1,
        prev;

    for (var i = 0; i < arr.length; i++) {
        prev = len;
        len = Math.min(len, arr[i].length);
        if (prev !== len) {
            index = i;
        }
    }

    return arr[index];
}

function max(arr) {
    var len = Number.MIN_VALUE,
        item,
        prev;

    for (var i = 0; i < arr.length; i++) {
        prev = len;
        len = Math.max(len, arr[i].length);
        if (prev !== len) {
            item = arr[i];
        }
    }

    return item;
}

/**
 * return the last N values of each, where N is the minimum length of an argument
 * @param {...Array} arguments provide 2 or more Arrays as arguments
 * @returns {Array}
 */
exports.trimEnd = function (a, b) {
    var result = [];
    var min = min(arguments);

    for (var i = 0; i < min.length; i++) {
        result[i] = map(arguments, function (arg) {
            return arg[i];
        });
    }

    return result;
};

/**
 * return the first MIN values of each, where MIN is the minimum length of an argument
 * @param {...Array} arguments provide 2 or more Arrays as arguments
 * @returns {Array}
 */
exports.trimStart = function () {

    var result = [];

    var min = min(arguments);

    for (var i = 0; i < min.length; i++) {
        result[i] = map(arguments, function (arg) {
            return arg[i + Math.abs(arg.length - min.length)];
        });
    }

    return result;
};

/**
 * return MIN values of each, where MIN is the minimum length of an argument and all other arguments
 * have their results interpolated through
 * @param {...Array} arguments provide 2 or more Arrays as arguments
 * @returns {Array}
 */
exports.interpolateShort = function () {

    var result = [];

    var min = min(arguments);

    for (var i = 0; i < min.length; i++) {
        result[i] = map(arguments, function (arg) {
            return arg[Math.ceil(scalemap(i, 0, min.length, 0, arg.length))];
        });
    }

    return result;
};

/**
 * return MAX values of each, where MAX is the maximum length of an argument and all other arguments have
 * their first value repeated
 * @param {...Array} arguments
 * @returns {Array}
 */
exports.repeatFirst = function () {

    var result = [];
    var maxArg = max(arguments);

    for (var i = 0; i < maxArg.length; i++) {
        result[i] = map(arguments, function (arg) {
            var diff = Math.abs(arg.length - maxArg.length);
            return arg[Math.max(i - diff, 0)];
        });
    }

    return result;
};

/**
 * return MAX values of each, where MAX is the maximum length of an argument and all other arguments have
 * their last value repeated
 * @param {...Array} arguments
 * @returns {Array}
 */
exports.repeatLast = function () {

    var result = [];
    var maxArg = max(arguments);

    for (var i = 0; i < maxArg.length; i++) {
        result[i] = map(arguments, function (arg) {
            return arg[Math.min(i, arg.length - 1)];
        });
    }

    return result;
};

/**
 * return MAX values of each, where MAX is the maximum length of an argument and all other arguments have
 * their values repeated from beginning to end
 * @param {...Array} arguments
 * @returns {Array}
 */
exports.wrap = function () {
    var result = [];
    var min = min(arguments);

    for (var i = 0; i < min.length; i++) {
        result[i] = map(arguments, function (arg) {
            return arg[i % min.length];
        });
    }

    return result;
};

/**
 * return MAX values of each, where MAX is the maximum length of an argument and all other arguments
 * flip their order and repeat
 * @param {...Array} arguments
 * @returns {Array}
 */
exports.flip = function () {

    var result = [],
        maxArg = max(arguments);

    for (var i = 0; i < maxArg.length; i++) {
        result[i] = map(arguments, function (arg) {
            return arg[i < arg.length ? i : arg.length - 2 - (i - arg.length)];
        });
    }

    return result;
};

var incrementIndices = function incrementIndices(indices, lengths) {
    for (var i = 0; i < indices.length; i++) {
        if (indices[i] < lengths[i] - 1) {
            indices[i]++;
            break;
        } else {
            indices[i] = 0;
        }
    }
    return indices;
};

var atLastValues = function atLastValues(indices, lengths) {
    return indices.length === indices.filter(function (index, i) {
        return index === lengths[i] - 1;
    }).length;
};
var extractValues = function extractValues(args, indices) {
    return map(args, function (arr, i) {
        return arr[indices[i]];
    });
};

/**
 * return all possible combinations of all provided arguments, incrementing left to right across arguments
 * @param {...Array} arguments
 * @returns {Array}
 */
exports.holistic = function () {
    var indices = map(arguments, zero);
    var lengths = map(arguments, function (a) {
        return a.length;
    });

    var result = [];

    result.push(extractValues(arguments, indices));

    while (!atLastValues(indices, lengths)) {
        result.push(extractValues(arguments, incrementIndices(indices, lengths)));
    }

    return result;
};

},{}]},{},[1])(1)
});