var util = require('util');
var IterableOnce = require('./iterable-once').IterableOnce;

var BUFFER_ERROR = "BufferedResponse instances only work on"
                    + " decoded character streams - please set"
                    + " the encoding first";

var BufferedResponse = function BufferedResponse(response, encoding, separator) {
    separator = (separator != null) ? separator : '\n';
    this._response = response;
    if (encoding != null) {
        response.setEncoding(encoding);
    }
    var buffer = [];
    var self = this;
    var index = 0;
    var report = (separator instanceof RegExp)
        ? function(chars) {
            var toEmit = chars.filter(function(c) {return !c.match(separator)});
            if (toEmit.length) {
                self.emit('data', toEmit.join(''), index++)
            }
        }
        : function(chars) {self.emit('data', chars.join(''), index++)};

    var splitHere = (separator instanceof RegExp)
        ? function(i) {return buffer[i].match(separator);}
        : (separator.length === 1)
          ? function(i) {return buffer[i] === separator;}
          : function(i) {return buffer.slice(i, i + separator.length).join('') === separator;};

    var howMany = (separator instanceof RegExp) ? 1 : separator.length;

    IterableOnce.call(this, response, {
        data: function(chunk) {
            if (Buffer.isBuffer(chunk)) {
                self.emit('error', BUFFER_ERROR);
            } else {
                buffer.splice.apply(buffer, [buffer.length, 0].concat(chunk.split('')));
                self.emit('_append_');
            }
        },
        end: function() {
            if (buffer.length) {
                report(buffer);
            }
            self.emit('end');
        }
    });

    this.on('_append_', function() {
        var i;
        for (i = 0; i < buffer.length; i++) {
            if (splitHere(i)) {
                report(buffer.splice(0, i));
                buffer.splice(0, howMany); // remove the separator.
                i = -1;
            }
        }
    });
};

BufferedResponse.prototype.setEncoding = function setEncoding(enc) {
    this._response.setEncoding(enc);
};

util.inherits(BufferedResponse, IterableOnce);

exports.BufferedResponse = BufferedResponse;
