var util = require("util");
var EventEmitter = require("events").EventEmitter;
var Deferred = require('underscore.deferred').Deferred;

var getArgs = function(argObj) {return Array.prototype.slice.call(argObj);}
var EVENTS = ['data', 'error', 'end', 'close'];

var tryCatch = function(f) {
    var iter = this;
    return function() {
        try {
            return f.apply(f, arguments);
        } catch (e) {
            iter.emit('error', e);
        }
    };
};

var IterableOnce = function IterableOnce(source, events) {
    EventEmitter.call(this);
    var self = this;
    var getProxy = function(eventName) {
        if (events != null && events[eventName]) {
            return events[eventName];
        }
        return function() {
            var args = getArgs(arguments);
            self.emit.apply(self, [eventName].concat(args));
        };
    };
    if (source != null) {
        EVENTS.forEach(function(evt) {source.on(evt, getProxy(evt))});
    }
};

util.inherits(IterableOnce, EventEmitter);

IterableOnce.prototype.done = function done(f) {
    if (f)
        this.on('end', f);
    return this;
};

IterableOnce.prototype.error = function error(f) {
    if (f)
        this.on('error', f); // Don't catch errors, as we are already in the error handler.
    return this;
};

var ieach = function forEach(f) {
    if (f)
        this.on('data', tryCatch.call(this, f));
    return this;
};

IterableOnce.prototype.forEach = ieach;
IterableOnce.prototype.each = ieach;

var imap = function map(f) {
    var ret, dataFn;
    if (f) {
        f = tryCatch.call(this, f);
        dataFn = function() {
            ret.emit('data', f.apply(f, arguments));
        };
    } else {
        dataFn = function () {
            var args = ['data'].concat([].slice.call(arguments, 0));
            ret.emit.apply(ret, args);
        };
    }
    ret = new IterableOnce(this, {data: dataFn});
    return ret;
};

IterableOnce.prototype.map = imap;
IterableOnce.prototype.fmap = imap;
IterableOnce.prototype.collect = imap;

var ifold = function fold(init, f) {
    var __FOLD_INIT__ = {};
    var ret = new Deferred();
    if (init != null && !f) {
        f = init;
        init = __FOLD_INIT__;
    }
    var memo = init;
    var self = this;
    this.each(function() {
        var args = getArgs(arguments);
        if (memo === __FOLD_INIT__) {
            memo = args[0];
        } else {
            memo = f.apply(self, [memo].concat(args));
        }
    });
    this.on('end', function() {
        if (memo === __FOLD_INIT__) {
            ret.fail('fold on empty iterable without initaliser');
        } else {
            ret.resolve(memo);
        }
    });
    return ret.promise();
};

IterableOnce.prototype.fold = ifold;
IterableOnce.prototype.foldl = ifold;
IterableOnce.prototype.reduce = ifold;

var ifilter = function filter(f) {
    var self = this;
    var ret;
    ret = new IterableOnce(this, {
        data: function() {
            if (f && f.apply(ret, arguments)) {
                ret.emit.apply(ret, ['data'].concat(getArgs(arguments)));
            }
        }
    });
    return ret;
};

IterableOnce.prototype.filter = ifilter;
IterableOnce.prototype.grep = ifilter;

exports.IterableOnce = IterableOnce;
