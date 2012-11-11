var RandomReader = require('./lib/random-reader').RandomReader;
var ShortReader = require('./lib/short-reader');
var BufferedReader = require('../lib/buffered-response').BufferedResponse;
var fs = require('fs');

var path = "test/data/favs.txt";
var expectedFull = fs.readFileSync(path, 'utf8');

exports.shortReaderTest = function(beforeExit, assert) {
    var n = 0;
    var text = "";

    new BufferedReader(ShortReader.getShortReader(path))
            .each(function (line) {text += line + '\n'})
            .done(function() {n++; assert.equal(text, expectedFull, 'Using each');});

    new BufferedReader(ShortReader.getShortReader(path))
            .fold(function(a, b) {return a + '\n' + b})
            .then(function(all)  {
                n++; 
                var expected = expectedFull.trim();
                assert.equal(all.trim(), expected, 
                    'GOT: >>' + all.trim() + '<<\nEXPECTED: >>' + expected + '<<');
            });

    new BufferedReader(ShortReader.getShortReader(path))
            .filter(function(line) {return line && !line.match(/spam/)})
            .map(function(line) {return line.split(/\s+/).length})
            .fold(function(a, b) {return a + b})
            .then(function(c) {
                n++; 
                assert.equal(c, 13, "Complex pipeline: got: " + c + ", expected 13")
             });

    beforeExit(function() {
        assert.equal(3, n, "All tests ran");
    });
};

exports.randomReaderTest = function(beforeExit, assert) {
    var n = 0;
    var text = "";

    new BufferedReader(new RandomReader(path))
            .each(function (line) {text += line + '\n'})
            .done(function() {n++; assert.equal(text, expectedFull, 'Using each');});

    new BufferedReader(new RandomReader(path))
            .fold(function(a, b) {return a + '\n' + b})
            .then(function(all)  {
                n++; 
                var expected = expectedFull.trim();
                assert.equal(all.trim(), expected, 
                    'GOT: >>' + all.trim() + '<<\nEXPECTED: >>' + expected + '<<');
            });

    new BufferedReader(new RandomReader(path))
            .filter(function(line) {return line && !line.match(/spam/)})
            .map(function(line)    {return line.split(/\s+/).length})
            .fold(function(a, b)   {return a + b})
            .then(function(c) {
                n++; 
                assert.equal(c, 13, "Complex pipeline: got: " + c + ", expected 13")
             });

    beforeExit(function() {
        assert.equal(3, n, "All tests ran");
    });
};

exports.WordByWord = function(beforeExit, assert) {
    var n = 0;
    // Tests use of regexps matching multiple characters.
    new BufferedReader(new RandomReader(path), null, /\s/)
            //.each(function(word, idx) {console.log("WORD " + idx + "| " + word)})
            .filter(function(word)         {return !word.match(/spam/)})
            .fold([0, 0], function(a, b)   {return [a[0] + b.length, a[1] + 1];})
            .then(function(stats) {
                n++; 
                assert.equal(
                    (stats[0] / stats[1]), 
                    (68 / 13),
                    "Complex pipeline: got: " 
                        + (stats[0]/stats[1]) 
                        + ", expected 68/13"
                )
             });

    beforeExit(function() {
        assert.equal(1, n, "All tests ran");
    });
};

exports.CatchesErrors = function(beforeExit, assert) {
    var n = 0;
    var rows = 0;
    var die = function () { throw new Error("Boom!"); };
    new BufferedReader(new RandomReader(path), null, /\s/)
            .each(function () {rows++})
            .each(die)
            .map(die)
            .error(function(e) {n++; assert.equal(e.message, "Boom!")});

    beforeExit(function() {
        assert.equal(rows * 2, n, "All tests ran: expected 2 tests per row, ran "
            + n + " for " + rows + " rows");
    });
};

exports.IgnoresNullCallbacks = function(beforeExit, assert) {
    var n = 0;
    // Tests use of regexps matching multiple characters.
    new BufferedReader(new RandomReader(path), null, /\s/)
            //.each(function(word, idx) {console.log("WORD " + idx + "| " + word)})
            .filter(function(word)         {return !word.match(/spam/)})
            .map(null)
            .fold([0, 0], function(a, b)   {return [a[0] + b.length, a[1] + 1];})
            .then(function(stats) {
                n++; 
                assert.equal(
                    (stats[0] / stats[1]), 
                    (68 / 13),
                    "Complex pipeline: got: " 
                        + (stats[0]/stats[1]) 
                        + ", expected 68/13"
                )
             });

    beforeExit(function() {
        assert.equal(1, n, "All tests ran");
    });
};



