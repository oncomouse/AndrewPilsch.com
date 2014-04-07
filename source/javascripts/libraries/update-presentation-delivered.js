// If the static site hasn't been updated in a while, this code
// can make sure that presentations (for now) are still displaying
// the correct presented data:
$(document).ready(function() {
	var now = Math.round(Date.now() / 1000);
	$('.presentation').each(function(i) {
		var $this = $(this);
		var $h2 = $this.find('.hideable h2').eq(0);
		if(parseInt($this.attr('data-timestamp')) < now && $h2.html() === "Upcoming Presentation") {
			$h2.html("Recent Presentation");
		}
	});
});