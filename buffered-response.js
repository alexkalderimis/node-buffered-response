var EventEmitter = require('events').EventEmitter;

var BufferedResponse = function BufferedResponse(response) {
    EventEmitter.call(this);
    this._response = response;
    this._buffer = [];
    var buffer = this._buffer;
    var self = this;

    response.on('data', function(chunk) {
        buffer.splice.apply(buffer, [buffer.length, 0].concat(chunk.split('')));
        self.emit('append');
    });

    this.on('append', function() {
        var i;
        for (i = 0; i < buffer.length; i++) {
            if (buffer[i] === '\n') {
                self.emit('line', buffer.splice(0, i).join(''));
                buffer.shift();
                i = -1;
            }
        }
    });

    response.on('end', function() {
        if (buffer.length) {
            self.emit('line', buffer.join(''), true);
        }
        self.emit('end');
    });

    response.on('error', function() {
        self.emit('error', Array.prototype.slice.call(arguments, 0));
    });
};

BufferedResponse.prototype.setEncoding = function setEncoding(enc) {
    this._response.setEncoding(enc);
};

BufferedResponse.prototype.__proto__ = EventEmitter.prototype;

exports.BufferedResponse = BufferedResponse;
