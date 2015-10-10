var assert = require('assert');
var movies = require('../server/movies');
var R = require('ramda');

describe('Movies', function() {

	it('return a single movie based on title and year', function () {
	  var query = {
		title: 'xXx',
		year: 2002
	  }

	  var expected = {
		message: 'Matched 1 of 160 movies total',
		results: [ { title: 'xXx', year: 2002 } ]
	  }

	  var actual = movies.getMovies(query);
	  assert.deepEqual(actual, expected);
	});

  	it('return all movies based on title', function () {
		var query = {
			title: 'xXx'
		}

		var expected = {
			message: 'Matched 2 of 160 movies total',
			results: [
				{ title: 'xXx', year: 2002 },
				{ title: 'xXx2: The Next Level', year: 2005 }
			]
		}

		var actual = movies.getMovies(query);
		assert.deepEqual(actual, expected);
	});

	it('return all movies based on year', function () {
		var query = {
			year: '2014'
		}

		var actual = movies.getMovies(query);
		assert.deepEqual(actual.message, 'Matched 16 of 160 movies total');
		assert.deepEqual(actual.results.length, 16);
	});

	it('return first 5 movies based on year', function () {
		var query = {
			year: '2014',
			limit: 5
		}

		var actual = movies.getMovies(query);
		assert.deepEqual(actual.message, 'Matched 16 of 160 movies total');
		assert.deepEqual(actual.results.length, 5);
		assert.deepEqual(actual.results[0], { title: '300: Rise of an Empire', year: 2014 });
	});

	it('return 2nd page of movies based on year', function () {
		var query = {
			year: '2014',
			limit: 5,
			pageNum: 2
		}

		var actual = movies.getMovies(query);
		assert.deepEqual(actual.message, 'Matched 16 of 160 movies total');
		assert.deepEqual(actual.results.length, 5);
		assert.deepEqual(actual.results[0], { title: 'Treehouse', year: 2014 });
	});

	it('return last page of movies based on year', function () {
		var query = {
			year: '2014',
			limit: 5,
			pageNum: 3
		}

		var actual = movies.getMovies(query);
		assert.deepEqual(actual.message, 'Matched 16 of 160 movies total');
		assert.deepEqual(actual.results.length, 1);
		assert.deepEqual(actual.results[0], { title: 'Zombeavers', year: 2014 });
	});
});