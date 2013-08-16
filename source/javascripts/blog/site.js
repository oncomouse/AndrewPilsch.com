// Set up fade-in for the colophone:
$(".about_site_link").on("click", function(){
	$(".about_site").addClass("show");
});

// Remove the paragraphs that Kramdown shouldn't be adding:
if($('.footnotes').length > 0) {
	$('.footnotes ol li p').each(function() {
		$(this).parent().html($(this).html());
	});
}

// Fix whitespace offset in code blocks:
$( 'pre code' ).each( function () {
	var lines, offset;
	lines = $( this ).text().split( '\n' );
	// how much white-space do we need to remove form each line?
	offset = lines[ 1 ].match( /^\s*/ )[ 0 ].length;
	lines = lines.map( function ( line ) {
		var output_line;
		if (line.match(/^\s/)) {
			output_line = line.slice( offset );
		} else {
			output_line = line;
		}
		return output_line;
	});
	$( this ).text( lines.join( '\n' ) );
});