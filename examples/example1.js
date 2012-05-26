var http = require('http');
var BufferedResponse = require('./buffered-response').BufferedResponse;

var opts = {
    host: 'www.flymine.org',
    method: 'GET',
    path: '/query/service/model'
};

var req = http.request(opts, function(res) {
    var br = new BufferedResponse(res);
    br.setEncoding('utf8');
    var lineNo = 0;
    br.on('line', function(line, last) {
        console.log("LINE " + lineNo++ + " >>> ", line);
        if (last) {
            console.log("ALL DONE!!");
        }
    });
    br.on('end', function() {
        console.log("GOODBYE!!");
    });
});
req.end();
