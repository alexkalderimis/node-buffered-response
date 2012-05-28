var IterableOnce = require('../lib/iterable-once').IterableOnce;

var myIter = new IterableOnce();

myIter.each(function(x) {
    console.log("-----\nEACH: ", x);
});

myIter.map(function(x) {return x * 2}).each(function(x) {
    console.log("MAP: ", x);
});

myIter.fold(function(a, b) { return a + b }).then(function(res) {
    console.log("REDUCTION: ", res)
});

myIter.grep(function(x) {return x % 2 == 0}).each(function(x) {
    console.log("FILTER: " + x + " is even")
});

for (var i = 0; i < 10; i++) {
    myIter.emit('data', i);
}
myIter.emit('end');
