var http = require('http');
var BufferedResponse = require('../lib/buffered-response').BufferedResponse;

// An example of an http resource that makes sense line by line.
var opts = {
    host: 'www.flymine.org',
    method: 'GET',
    path: '/query/service/model'
};

var req = http.request(opts, function(res) {
    var br = new BufferedResponse(res, 'utf8');
    br.each(function(line, idx) {
        console.log("ll. " + (idx + 1) + "|", line);
    });
    br.done(function() {
        console.log("GOODBYE!!");
    });
    br.error(function(e) {
        console.log("ERROR: ", e);
    });
});
req.end();
