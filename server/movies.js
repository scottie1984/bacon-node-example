var R = require('ramda');
var movies = require('./data.json');

var getMoviesArray = R.prop('movies', movies);
var filterObjects = R.curry(function(objects, query) {
	return R.filter(R.where(query))(objects);
});
var filterMovies = R.compose(
	R.map(R.pick(['title', 'year'])),
	filterObjects(getMoviesArray)
);

var transformQuery = R.mapObjIndexed(function(val, key) {
	if (R.contains(key, ['year', 'duration', 'rating'])) {
		return R.equals(parseInt(val));
	} else if (R.contains(key, ['directors', 'actors'])) {
        return R.compose(R.contains({name: val}), R.prop('list'));
	} else {
		return R.test(new RegExp(val, 'i'));;
	}
});

function calculateMessage(matchedMovies) {
    var message = 'No matching items';
    if (matchedMovies.length > 0) {
        message = 'Matched ' + matchedMovies.length + ' of ' + getMoviesArray.length + ' movies total';
    }
    return message;
}

var getPaged = function(limit, pageNum) {
	var startIndex = 0;
	var endIndex = Infinity;
	if (limit && pageNum) {
	     startIndex = pageNum * limit;
	     endIndex = startIndex + limit;
	} else if (limit) {
		 endIndex = limit;
	}
	return R.slice(startIndex, endIndex);
};

var processQueryOnMovies = R.compose(filterMovies, transformQuery, R.omit(['limit', 'pageNum']))

function getMovies(query) {

	var getPagedMovies = getPaged(parseInt(R.prop('limit', query)), parseInt(R.prop('pageNum', query)));
	var filteredMovies = processQueryOnMovies(query);

	return {
   		message: calculateMessage(filteredMovies),
   		results: getPagedMovies(filteredMovies)
    }
}

module.exports = {
	getMovies: getMovies
}