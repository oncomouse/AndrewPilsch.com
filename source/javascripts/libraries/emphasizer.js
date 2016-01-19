var emphasize_these = [
	".emphasize"
];

function emphasize() {
	if(typeof $isotope_container == "undefined" || $isotope_container.isotope == "undefined") {
		window.setTimeout(emphasize, 50);
		return;
	}
	
	var defer = $.Deferred();
	var em = defer.then(function() {
		emphasize_these.forEach(function(foobar) {
			$(foobar).removeClass('col1').addClass('col2');
		});
	});
	
	defer.resolve();
	em.done(function() {
		$isotope_container.isotope();
	});
}

$(document).ready(function() {
	emphasize();
});