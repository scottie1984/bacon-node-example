var express = require('express');
var app = express();
var movies = require('./movies');

app.use(express.static(__dirname + '/../public'));

app.use('/api/movies', function(req, res) {
   res.send(movies.getMovies(req.query));
})

app.listen(8000, function(){
	console.log('App started on port 8000!');
});