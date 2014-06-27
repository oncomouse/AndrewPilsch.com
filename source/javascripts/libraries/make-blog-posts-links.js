$(document).ready(function() {
	$('.box.blog').each(function() {
		var $this = $(this);
		var url = $this.attr('data-url');
		if (typeof url === "undefined") {
			return;
		}
		$this.on("click", function(){
			document.location.href = url;
		});
	})
});