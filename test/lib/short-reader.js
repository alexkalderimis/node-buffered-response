var fs = require('fs');

var getShortReader = function getShortReader(path) {
    return fs.createReadStream(path, {flags: 'r', encoding: 'utf8', bufferSize: 16});
};

exports.getShortReader = getShortReader;
