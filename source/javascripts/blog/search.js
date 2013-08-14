/* Set up JSON Search */
$('form.search').on('submit', function(e) {
	var search_term;
	e.preventDefault();
	search_term = $('.search_term').val().toLowerCase();
	if ($('.search_results').length == 0) {
		$("<div class='search_results'><div class='content'><h2>Searching ...</h2></div></div>").appendTo($(document.body));
	}
	
	$('.search_results').addClass('show');
	
	$.getJSON('/blog/articles.json', function(data) {
		var i, result, results, value, _i, _j, _len, _len1, _results;
		results = [];
		for(var i=0; i<data.length; i++) {
			article = data[i];
			value = 0;
			if (article.title.toLowerCase().split(search_term).length - 1 !== 0) {
				value = 10;
			}
			if (article.content.toLowerCase().split(search_term).length - 1 !== 0) {
				value += (article.content.toLowerCase().split(search_term).length - 1) * 5;
			}
			if (value !== 0) {
				article.value = value;
				results.push(article);
			}
		}
		
		$('.search_results').html("<div class='close'></div><div class='content'><h2>Articles Matching \"" + search_term + "\"</h2></div>");
		
		$('.search_results .close').on("click", function() {
			$('.search_results').remove();
		});
		if (results !== []) {
			_results = results.map(function(result, i){

				return $('.search_results .content').append('<article><p class="title"><a class="copy-bg" href="' + result.url + '">' + result.title + '</a></p><div class="article">' + result.summary + '<p class="more"><a href="' + result.url + '">Read More</a>.</p></div></article>');
			});
			return _results;
		} else {
			return $('.search_results .content').append('<p>No results found. Sorry.</p>');
		}
	});
	return false;
});