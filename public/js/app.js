$( document ).ready(function() {
	var inputs = $('#search')
		.asEventStream('keyup change')
		.map(function(event) { return event.target.value; })
		.throttle(500)
		.skipDuplicates();

	var property = Bacon.UI.optionValue($("#prop"), 'title')

	var inputsAndProps = Bacon.combineWith(function(n1, n2) { return {prop: n1, search: n2}; },
			  property,
			  inputs);

	var suggestions = inputsAndProps.flatMapLatest(function(value) {
		var url = 'http://localhost:8000/api/movies?' + value.prop + '=' + value.search;
		if (value.search.length < 3) {
			return Bacon.once({message: "Please enter 3 characters or more", results: []})
		} else {
			return Bacon.fromPromise(
				$.getJSON(url));
		}
	});

	suggestions.onValue(function(resp) {
		var $results = $('#results').empty();
		resp.results.forEach(function(s) {
			$('<li>').text(s.title + ' [' + s.year + ']').appendTo($results);
		});
		$('#message').text(resp.message);
	});

	var query = inputs.flatMapLatest(function(value) {
		return value;
	}).toProperty();

	query.onValue(function() {
		$("h1").show();
	});

	query.assign($('#query'), 'text');
});
