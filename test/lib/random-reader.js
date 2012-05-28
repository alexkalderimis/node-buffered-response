var   fs = require('fs')
    , util = require('util')
    , events = require('events')
    , IterableOnce = require('../../lib/iterable-once');

var RandomReader = function RandomReader(path) {
    events.EventEmitter.call(this);
    var self = this;
    fs.readFile(path, "utf8", function(err, data) {
        var chars, upTo;
        if (err) {
            self.emit('error', err);
        } else {
            chars = data.split('');
            while (chars.length) {
                upTo = Math.floor((Math.random() * chars.length) + 1);
                if (upTo) {
                    self.emit('data', chars.splice(0, upTo).join(''));
                }
            }
        }
        self.emit('end');
    });
};

util.inherits(RandomReader, events.EventEmitter);

exports.RandomReader = RandomReader;
