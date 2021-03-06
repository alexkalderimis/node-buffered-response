Buffered Response Reader for Node.js
====================================

[![Build Status][status]][ci]

A small utility class to wrap response objects
from the http module, and provide line-by-line
iteration.

SYNOPSIS
========

```javascript
    var http = require('http');
    var BufferedResponse = require('buffered-response').BufferedResponse;

    var options = {
        host: 'foo',
        path: '/a/b?q=3',
        method: 'GET'
    };

    var req = http.request(options, function(resp) {
        var reader = new BufferedResponse(resp);
        reader.setEncoding('utf8');
        var lineno = 1;
        reader.on('line', function(line) {
            console.log("LINE " + lineno++ + ": " + line);
        });
    });

    req.end();
```

CHANGELOG
=========

0.0.1 Intial version
0.0.2 (Thu Nov  8 16:43:50 GMT 2012): Moved from jquery-deferred to underscore-deferred.
0.0.3 (Sun Nov 11 16:33:20 GMT 2012): Allow null values to be passed in as callbacks (they are ignored).
0.0.4 ..: Also ignore null filters
0.0.5 (Sun Nov 11 23:10:35 GMT 2012): Wrap all callbacks in try-catch.

[status]: https://travis-ci.org/alexkalderimis/node-buffered-response.svg?branch=master
[ci]: https://travis-ci.org/alexkalderimis/node-buffered-response
