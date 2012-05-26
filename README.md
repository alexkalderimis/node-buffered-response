Buffered Response Reader for Node.js
====================================

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

